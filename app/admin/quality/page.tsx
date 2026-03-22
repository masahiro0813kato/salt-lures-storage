"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LureItem {
  id: number;
  lure_name_ja: string;
  lure_id: string;
  lure_maker?: { lure_maker_name_ja: string };
  missing?: string[];
}

export default function AdminQualityPage() {
  const router = useRouter();
  const [noImage, setNoImage] = useState<LureItem[]>([]);
  const [noSeries, setNoSeries] = useState<LureItem[]>([]);
  const [noSpecs, setNoSpecs] = useState<LureItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"image" | "series" | "specs">("image");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/admin/analytics/quality");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setNoImage(data.noImage || []);
        setNoSeries(data.noSeries || []);
        setNoSpecs(data.noSpecs || []);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  const tabs = [
    { key: "image" as const, label: "画像なし", count: noImage.length, color: "red" },
    { key: "series" as const, label: "シリーズ未設定", count: noSeries.length, color: "yellow" },
    { key: "specs" as const, label: "スペック未入力", count: noSpecs.length, color: "orange" },
  ];

  const currentList = activeTab === "image" ? noImage : activeTab === "series" ? noSeries : noSpecs;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">データ品質チェック</h2>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`bg-white rounded-lg shadow p-6 text-left transition-all ${
              activeTab === tab.key ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="text-sm text-gray-500">{tab.label}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {isLoading ? "-" : tab.count}
              </span>
              {!isLoading && tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded ${
                  tab.color === "red" ? "bg-red-100 text-red-700" :
                  tab.color === "yellow" ? "bg-yellow-100 text-yellow-700" :
                  "bg-orange-100 text-orange-700"
                }`}>
                  要対応
                </span>
              )}
              {!isLoading && tab.count === 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                  OK
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">
            {tabs.find((t) => t.key === activeTab)?.label}一覧
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2 text-left text-gray-500 font-normal">ID</th>
              <th className="px-4 py-2 text-left text-gray-500 font-normal">ルアー名</th>
              <th className="px-4 py-2 text-left text-gray-500 font-normal">メーカー</th>
              {activeTab === "specs" && (
                <th className="px-4 py-2 text-left text-gray-500 font-normal">未入力項目</th>
              )}
              <th className="px-4 py-2 text-right text-gray-500 font-normal">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={activeTab === "specs" ? 5 : 4} className="px-4 py-8 text-center text-gray-400">
                  読み込み中...
                </td>
              </tr>
            ) : currentList.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "specs" ? 5 : 4} className="px-4 py-8 text-center text-green-600">
                  すべてのデータが入力されています
                </td>
              </tr>
            ) : (
              currentList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{item.id}</td>
                  <td className="px-4 py-2 text-gray-900">{item.lure_name_ja}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {item.lure_maker?.lure_maker_name_ja || "-"}
                  </td>
                  {activeTab === "specs" && (
                    <td className="px-4 py-2">
                      <div className="flex gap-1 flex-wrap">
                        {item.missing?.map((m) => (
                          <span key={m} className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/lures/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      編集
                    </Link>
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
