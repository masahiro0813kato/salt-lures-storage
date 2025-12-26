'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useColorExtraction } from '@/hooks/useColorExtraction';
import { useThreeBackground } from '@/hooks/useThreeBackground';
import { isDefaultImage } from '@/constants/images';
import ShaderDebugUI, { type ShaderDebugParams } from '../ShaderDebugUI';

interface LureDetailBackgroundProps {
  imageUrl: string | null | undefined;
  blur?: number;
  showDebugUI?: boolean;
}

export default function LureDetailBackground({
  imageUrl,
  blur = 0.289,
  showDebugUI = false,
}: LureDetailBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [debugParams, setDebugParams] = useState<ShaderDebugParams | undefined>(undefined);

  // ウェイト倍率を計算
  const weightMultipliers: [number, number, number, number] = debugParams
    ? [
        debugParams.weightMultiplier1,
        debugParams.weightMultiplier2,
        debugParams.weightMultiplier3,
        debugParams.weightMultiplier4,
      ]
    : [0.7, 1.5, 1.5, 0.7];

  const { palette, isLoading, error } = useColorExtraction(imageUrl, undefined, weightMultipliers);

  // 親要素のサイズを監視
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // 初回実行
    updateDimensions();

    // ResizeObserverで親要素のサイズ変更を監視
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleDebugParamsChange = useCallback((params: ShaderDebugParams) => {
    setDebugParams(params);
  }, []);

  const canvasRef = useThreeBackground({
    palette,
    width: dimensions.width,
    height: dimensions.height,
    blur: debugParams?.blur ?? blur,
    debugParams: debugParams ? {
      saturation: debugParams.saturation,
      lightness: debugParams.lightness,
      contrast: debugParams.contrast,
      hueShift: debugParams.hueShift,
      timeScale: debugParams.timeScale,
      noiseScale1: debugParams.noiseScale1,
      noiseScale2: debugParams.noiseScale2,
      distortionAmount: debugParams.distortionAmount,
    } : undefined,
  });

  const [isVisible, setIsVisible] = useState(false);

  // paletteが準備できたらフェードイン
  useEffect(() => {
    if (palette && !isLoading && !error) {
      // 少し遅延させてスムーズに
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [palette, isLoading, error]);

  console.log('LureDetailBackground:', { imageUrl, dimensions, palette, isLoading, error });

  // デフォルト画像または画像なしの場合は白背景
  if (isDefaultImage(imageUrl)) {
    console.log('Showing white background: default image');
    return <div ref={containerRef} className="absolute inset-0 bg-white" />;
  }

  // エラー時は白背景
  if (error) {
    console.log('Showing white background: error', error);
    return <div ref={containerRef} className="absolute inset-0 bg-white" />;
  }

  console.log('Rendering canvas or loading');

  // ローディング中またはcanvas準備中は白背景を表示
  // paletteがある場合はcanvasを重ねてフェードイン
  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* 白背景（フォールバック） */}
      <div
        className="absolute inset-0 bg-white transition-opacity duration-500"
        style={{ opacity: isVisible ? 0 : 1 }}
      />

      {/* Three.jsキャンバス（フェードイン） */}
      {palette && dimensions.width > 0 && dimensions.height > 0 && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 transition-opacity duration-1000 ease-out"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            opacity: isVisible ? 1 : 0
          }}
        />
      )}

      {/* デバッグUI */}
      {showDebugUI && <ShaderDebugUI onParamsChange={handleDebugParamsChange} palette={palette} />}
    </div>
  );
}
