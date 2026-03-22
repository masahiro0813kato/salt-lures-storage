"use client";

import { useState, useEffect } from "react";

interface BreakdownItem {
  maker_name?: string;
  series_name?: string;
  category_name?: string;
  view_count: number;
  lure_count: number;
}

interface CategoryLure {
  rank: number;
  view_count: number;
  lure_id: number;
  lure_name_ja: string;
  lure_name_en: string;
  lure_maker_name_en: string;
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
  const [categories, setCategories] = useState<BreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryLures, setCategoryLures] = useState<CategoryLure[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/admin/analytics/breakdown?period=${period}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setMakers(data.makers || []);
        setSeries(data.series || []);
        setCategories(data.categories || []);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [period]);

  const handleCategoryClick = async (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      setCategoryLures([]);
      return;
    }
    setSelectedCategory(categoryName);
    setIsCategoryLoading(true);
    const res = await fetch(
      `/api/admin/analytics/category-lures?category=${encodeURIComponent(categoryName)}&period=${period}&limit=10`
    );
    if (res.ok) {
      const data = await res.json();
      setCategoryLures(data.lures || []);
    }
    setIsCategoryLoading(false);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        {/* カテゴリー別 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">カテゴリー別閲覧数</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2 text-left text-gray-500 font-normal">カテゴリー</th>
                <th className="px-4 py-2 text-right text-gray-500 font-normal">ルアー数</th>
                <th className="px-4 py-2 text-right text-gray-500 font-normal">閲覧数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">読み込み中...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">データなし</td>
                </tr>
              ) : (
                categories.map((item, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-gray-50 cursor-pointer ${selectedCategory === item.category_name ? "bg-blue-50" : ""}`}
                    onClick={() => handleCategoryClick(item.category_name || "")}
                  >
                    <td className="px-4 py-2 text-blue-600">{item.category_name}</td>
                    <td className="px-4 py-2 text-right text-gray-500">{item.lure_count}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">{item.view_count.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* カテゴリー内ルアーランキング */}
      {selectedCategory && (
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-700">
              「{selectedCategory}」カテゴリー内ランキング
            </h3>
            <button
              onClick={() => { setSelectedCategory(null); setCategoryLures([]); }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              閉じる
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2 text-left text-gray-500 font-normal w-16">順位</th>
                <th className="px-4 py-2 text-left text-gray-500 font-normal">ルアー名</th>
                <th className="px-4 py-2 text-left text-gray-500 font-normal">メーカー</th>
                <th className="px-4 py-2 text-right text-gray-500 font-normal w-24">閲覧数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isCategoryLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">読み込み中...</td>
                </tr>
              ) : categoryLures.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">データなし</td>
                </tr>
              ) : (
                categoryLures.map((item) => (
                  <tr key={item.lure_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        item.rank <= 3 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-gray-900">{item.lure_name_ja}</div>
                      <div className="text-xs text-gray-500">{item.lure_name_en}</div>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{item.lure_maker_name_en || "-"}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">{item.view_count.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
