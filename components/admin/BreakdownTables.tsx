"use client";

import { useState, useEffect } from "react";

interface BreakdownItem {
  maker_name?: string;
  series_name?: string;
  view_count: number;
  lure_count: number;
}

const periods = [
  { value: "today", label: "今日" },
  { value: "weekly", label: "7日" },
  { value: "monthly", label: "30日" },
  { value: "yearly", label: "年間" },
  { value: "all", label: "全期間" },
];

export default function BreakdownTables() {
  const [period, setPeriod] = useState("monthly");
  const [makers, setMakers] = useState<BreakdownItem[]>([]);
  const [series, setSeries] = useState<BreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/admin/analytics/breakdown?period=${period}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setMakers(data.makers || []);
        setSeries(data.series || []);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [period]);

  return (
    <div className="mb-8">
      {/* 期間切替 */}
      <div className="flex gap-1 mb-4">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-3 py-1.5 rounded-md text-sm ${
              period === p.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* メーカー別 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">メーカー別閲覧数</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2 text-left text-gray-500 font-normal">メーカー</th>
                <th className="px-4 py-2 text-right text-gray-500 font-normal">ルアー数</th>
                <th className="px-4 py-2 text-right text-gray-500 font-normal">閲覧数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">読み込み中...</td>
                </tr>
              ) : makers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">データなし</td>
                </tr>
              ) : (
                makers.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{item.maker_name}</td>
                    <td className="px-4 py-2 text-right text-gray-500">{item.lure_count}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">{item.view_count.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* シリーズ別 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">シリーズ別閲覧数</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2 text-left text-gray-500 font-normal">シリーズ</th>
                <th className="px-4 py-2 text-right text-gray-500 font-normal">ルアー数</th>
                <th className="px-4 py-2 text-right text-gray-500 font-normal">閲覧数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">読み込み中...</td>
                </tr>
              ) : series.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">データなし</td>
                </tr>
              ) : (
                series.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{item.series_name}</td>
                    <td className="px-4 py-2 text-right text-gray-500">{item.lure_count}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">{item.view_count.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
