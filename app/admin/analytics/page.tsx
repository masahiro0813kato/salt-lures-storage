"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface RankingItem {
  rank: number;
  view_count: number;
  lure_id: number;
  lure_name_ja: string;
  lure_name_en: string;
  lure_maker_name_en: string;
  url_code: string;
  lure_image_id: string;
}

interface Summary {
  today: number;
  month: number;
  total: number;
}

const periods = [
  { value: "today", label: "今日" },
  { value: "weekly", label: "7日間" },
  { value: "monthly", label: "30日間" },
  { value: "yearly", label: "年間" },
  { value: "all", label: "全期間" },
];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("monthly");
  const [limit, setLimit] = useState(20);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [summary, setSummary] = useState<Summary>({ today: 0, month: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`/api/admin/analytics?period=${period}&limit=${limit}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setRankings(data.rankings || []);
    setSummary(data.summary || { today: 0, month: 0, total: 0 });
    setIsLoading(false);
  }, [period, limit, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">閲覧ランキング</h2>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">今日の閲覧数</div>
          <div className="text-3xl font-bold text-gray-900">{summary.today.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">30日間の閲覧数</div>
          <div className="text-3xl font-bold text-gray-900">{summary.month.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">全期間の閲覧数</div>
          <div className="text-3xl font-bold text-gray-900">{summary.total.toLocaleString()}</div>
        </div>
      </div>

      {/* 期間切替・表示件数 */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex gap-1">
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
        <select
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value, 10))}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
        >
          <option value={20}>TOP 20</option>
          <option value={50}>TOP 50</option>
          <option value={100}>全件</option>
        </select>
      </div>

      {/* ランキングテーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-16">順位</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">ルアー名</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">メーカー</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium w-24">閲覧数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  読み込み中...
                </td>
              </tr>
            ) : rankings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  データがありません
                </td>
              </tr>
            ) : (
              rankings.map((item) => (
                <tr key={item.lure_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        item.rank <= 3
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.lure_name_ja}</div>
                    <div className="text-xs text-gray-500">{item.lure_name_en}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.lure_maker_name_en || "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {item.view_count.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
