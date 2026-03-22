"use client";

import { useState, useEffect } from "react";

interface DailyData {
  date: string;
  count: number;
}

export default function DailyViewsChart() {
  const [data, setData] = useState<DailyData[]>([]);
  const [days, setDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/admin/analytics/daily?days=${days}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.daily || []);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [days]);

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const chartHeight = 200;
  const chartWidth = 100; // percentage

  // SVGパス生成
  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
    const y = chartHeight - (d.count / maxCount) * (chartHeight - 20);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = linePath + ` L ${points[points.length - 1]?.x || 0} ${chartHeight} L ${points[0]?.x || 0} ${chartHeight} Z`;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">閲覧数推移</h3>
        <div className="flex gap-1">
          {[
            { value: 7, label: "7日" },
            { value: 30, label: "30日" },
            { value: 90, label: "90日" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDays(option.value)}
              className={`px-3 py-1 rounded text-xs ${
                days === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
          読み込み中...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
          データがありません
        </div>
      ) : (
        <div>
          {/* グラフ */}
          <div className="relative" style={{ height: `${chartHeight}px` }}>
            {/* Y軸目盛り */}
            <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-400">
              <span>{maxCount}</span>
              <span>{Math.round(maxCount / 2)}</span>
              <span>0</span>
            </div>
            {/* グラフエリア */}
            <div className="ml-12">
              <svg
                viewBox={`0 0 100 ${chartHeight}`}
                preserveAspectRatio="none"
                className="w-full"
                style={{ height: `${chartHeight}px` }}
              >
                {/* グリッドライン */}
                <line x1="0" y1={chartHeight / 2} x2="100" y2={chartHeight / 2} stroke="#f0f0f0" strokeWidth="0.5" />
                <line x1="0" y1={chartHeight} x2="100" y2={chartHeight} stroke="#e0e0e0" strokeWidth="0.5" />

                {/* エリア */}
                {points.length > 1 && (
                  <path d={areaPath} fill="rgba(59, 130, 246, 0.1)" />
                )}

                {/* ライン */}
                {points.length > 1 && (
                  <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                )}

                {/* ドット */}
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="2"
                    fill="#3b82f6"
                    vectorEffect="non-scaling-stroke"
                  >
                    <title>{p.date}: {p.count}件</title>
                  </circle>
                ))}
              </svg>
            </div>
          </div>

          {/* X軸ラベル */}
          <div className="ml-12 flex justify-between mt-1 text-xs text-gray-400">
            <span>{data[0]?.date.slice(5)}</span>
            {data.length > 2 && (
              <span>{data[Math.floor(data.length / 2)]?.date.slice(5)}</span>
            )}
            <span>{data[data.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
