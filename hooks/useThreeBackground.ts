import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '@/shaders/liquidGradient/shaders';
import { ShaderUniforms } from '@/types/shader';
import { adjustColor } from '@/lib/colorUtils';

interface ExtractedColor {
  baseRgb: [number, number, number];
  weight: number;
  score: number;
  isNeutral: boolean;
}

interface UseThreeBackgroundParams {
  palette: ExtractedColor[] | null;
  width: number;
  height: number;
  blur?: number;
  debugParams?: {
    saturation: number;
    lightness: number;
    contrast: number;
    hueShift: number;
    timeScale: number;
    noiseScale1: number;
    noiseScale2: number;
    distortionAmount: number;
  };
}

export function useThreeBackground({
  palette,
  width,
  height,
  blur = 0.4,
  debugParams,
}: UseThreeBackgroundParams) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const uniformsRef = useRef<ShaderUniforms | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Three.js初期化
  useEffect(() => {
    console.log('useThreeBackground effect:', {
      hasCanvas: !!canvasRef.current,
      palette: palette?.length,
      width,
      height
    });

    if (!canvasRef.current || !palette || palette.length === 0) {
      console.log('useThreeBackground: early return', {
        hasCanvas: !!canvasRef.current,
        hasPalette: !!palette,
        paletteLength: palette?.length
      });
      return;
    }

    console.log('useThreeBackground: initializing Three.js');
    const canvas = canvasRef.current;

    // レンダラー作成
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // シーン作成
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // カメラ作成（正投影）
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    // 色補正パラメータ（デバッグパラメータまたはデフォルト値）
    const colorAdjustParams = debugParams ? {
      saturation: debugParams.saturation,
      lightness: debugParams.lightness,
      contrast: debugParams.contrast,
      hueShift: debugParams.hueShift,
    } : {
      saturation: 0.5,
      lightness: 0.15,
      contrast: 1.0,
      hueShift: 0,
    };

    // パレットから色とウェイトを抽出
    const colors = palette.map((c) => adjustColor(c.baseRgb, colorAdjustParams));
    const weights = palette.map((c) => c.weight);

    // 4色に満たない場合は白で埋める
    while (colors.length < 4) {
      colors.push(new THREE.Vector3(1, 1, 1));
      weights.push(0.25);
    }

    // Uniformsの初期化
    const uniforms: any = {
      uTime: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uColors: { value: colors.slice(0, 4) },
      uWeights: { value: weights.slice(0, 4) },
      uBlur: { value: blur },
      uTimeScale: { value: debugParams?.timeScale ?? 0.5 },
      uNoiseScale1: { value: debugParams?.noiseScale1 ?? 0.5 },
      uNoiseScale2: { value: debugParams?.noiseScale2 ?? 1.0 },
      uDistortion: { value: debugParams?.distortionAmount ?? 0.2 },
    };
    uniformsRef.current = uniforms;

    // シェーダーマテリアル作成
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });

    // ジオメトリ作成（全画面クアッド）
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // アニメーションループ（テストコード完全再現）
    const clock = new THREE.Clock();
    let accumulatedTime = 0;
    const animate = () => {
      if (!uniformsRef.current) return;

      accumulatedTime += clock.getDelta() * 0.153; // speed: 0.153

      uniformsRef.current.uTime.value = accumulatedTime;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    console.log('useThreeBackground: starting animation');
    animate();

    // クリーンアップ
    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [palette, width, height, blur, debugParams]);

  // リサイズ処理
  useEffect(() => {
    if (!rendererRef.current || !uniformsRef.current) return;

    rendererRef.current.setSize(width, height);
    uniformsRef.current.uResolution.value.set(width, height);
  }, [width, height]);

  return canvasRef;
}
