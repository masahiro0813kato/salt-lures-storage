'use client';

import { useState, useEffect } from 'react';

interface ExtractedColor {
  baseRgb: [number, number, number];
  weight: number;
  score: number;
  isNeutral: boolean;
}

interface ShaderDebugUIProps {
  onParamsChange: (params: ShaderDebugParams) => void;
  palette?: ExtractedColor[] | null;
}

export interface ShaderDebugParams {
  blur: number;
  saturation: number;
  lightness: number;
  contrast: number;
  hueShift: number;
  timeScale: number;
  noiseScale1: number;
  noiseScale2: number;
  distortionAmount: number;
}

const defaultParams: ShaderDebugParams = {
  blur: 0.289,
  saturation: 0.5,
  lightness: 0.15,
  contrast: 1.0,
  hueShift: 0,
  timeScale: 0.153, // speed: 0.153
  noiseScale1: 0.5,
  noiseScale2: 1.0,
  distortionAmount: 0.2,
};

export default function ShaderDebugUI({ onParamsChange, palette }: ShaderDebugUIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<ShaderDebugParams>(defaultParams);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    onParamsChange(params);
  }, [params, onParamsChange]);

  const updateParam = (key: keyof ShaderDebugParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const resetParams = () => {
    setParams(defaultParams);
  };

  const copyParams = () => {
    const json = JSON.stringify(params, null, 2);
    navigator.clipboard.writeText(json);
    alert('パラメータをクリップボードにコピーしました');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-black text-white px-4 py-2 rounded shadow-lg hover:bg-gray-800"
      >
        🎨 デバッグUI
      </button>
    );
  }

  // RGB値を16進数カラーコードに変換
  const rgbToHex = (rgb: [number, number, number]) => {
    const r = Math.round(rgb[0] * 255);
    const g = Math.round(rgb[1] * 255);
    const b = Math.round(rgb[2] * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 text-white p-4 rounded-lg shadow-2xl w-80 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">シェーダーデバッグ</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xl leading-none hover:text-gray-400"
        >
          ×
        </button>
      </div>

      {/* パレット表示セクション */}
      {palette && palette.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="w-full text-left font-semibold mb-2 hover:text-gray-300 flex justify-between items-center"
          >
            <span>抽出カラー ({palette.length}色)</span>
            <span>{showPalette ? '▼' : '▶'}</span>
          </button>

          {showPalette && (
            <div className="space-y-2">
              {palette.map((color, index) => {
                const hexColor = rgbToHex(color.baseRgb);
                const rgbDisplay = `rgb(${Math.round(color.baseRgb[0] * 255)}, ${Math.round(color.baseRgb[1] * 255)}, ${Math.round(color.baseRgb[2] * 255)})`;

                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-12 h-12 rounded border border-gray-600 flex-shrink-0"
                      style={{ backgroundColor: hexColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono truncate">{hexColor}</div>
                      <div className="text-gray-400 truncate">{rgbDisplay}</div>
                      <div className="text-gray-500">
                        Weight: {color.weight.toFixed(3)} | Score: {color.score.toFixed(2)}
                        {color.isNeutral && ' | Neutral'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 text-sm">
        {/* Blur */}
        <div>
          <label className="block mb-1">
            Blur: {params.blur.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={params.blur}
            onChange={(e) => updateParam('blur', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Saturation */}
        <div>
          <label className="block mb-1">
            Saturation: {params.saturation.toFixed(2)}
          </label>
          <input
            type="range"
            min="-0.5"
            max="0.5"
            step="0.05"
            value={params.saturation}
            onChange={(e) => updateParam('saturation', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Lightness */}
        <div>
          <label className="block mb-1">
            Lightness: {params.lightness.toFixed(2)}
          </label>
          <input
            type="range"
            min="-0.3"
            max="0.3"
            step="0.05"
            value={params.lightness}
            onChange={(e) => updateParam('lightness', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Contrast */}
        <div>
          <label className="block mb-1">
            Contrast: {params.contrast.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={params.contrast}
            onChange={(e) => updateParam('contrast', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Hue Shift */}
        <div>
          <label className="block mb-1">
            Hue Shift: {params.hueShift.toFixed(0)}°
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={params.hueShift}
            onChange={(e) => updateParam('hueShift', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Time Scale */}
        <div>
          <label className="block mb-1">
            Time Scale: {params.timeScale.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={params.timeScale}
            onChange={(e) => updateParam('timeScale', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Noise Scale 1 */}
        <div>
          <label className="block mb-1">
            Noise Scale 1: {params.noiseScale1.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={params.noiseScale1}
            onChange={(e) => updateParam('noiseScale1', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Noise Scale 2 */}
        <div>
          <label className="block mb-1">
            Noise Scale 2: {params.noiseScale2.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={params.noiseScale2}
            onChange={(e) => updateParam('noiseScale2', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Distortion Amount */}
        <div>
          <label className="block mb-1">
            Distortion: {params.distortionAmount.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.0"
            max="0.5"
            step="0.01"
            value={params.distortionAmount}
            onChange={(e) => updateParam('distortionAmount', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={resetParams}
          className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm"
        >
          リセット
        </button>
        <button
          onClick={copyParams}
          className="flex-1 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm"
        >
          コピー
        </button>
      </div>
    </div>
  );
}
