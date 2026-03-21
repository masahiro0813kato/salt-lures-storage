"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LureItem {
  id: number;
  lure_name_ja: string;
  lure_name_en: string;
  lure_length: number | null;
  lure_weight: number | null;
  is_available: boolean;
  lure_series_ja: string | null;
  lure_maker?: { id: number; lure_maker_name_ja: string; lure_maker_name_en: string };
  lure_category?: { id: number; category_name_ja: string };
}

export default function AdminLuresPage() {
  const router = useRouter();
  const [lures, setLures] = useState<LureItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchLures = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "20",
    });
    if (search) params.append("search", search);

    const res = await fetch(`/api/admin/lures?${params}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setLures(data.lures || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setIsLoading(false);
  }, [page, search, router]);

  useEffect(() => {
    fetchLures();
  }, [fetchLures]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/lures/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteId(null);
      fetchLures();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ルアー管理</h2>
        <Link
          href="/admin/lures/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          新規作成
        </Link>
      </div>

      {/* 検索 */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ルアー名で検索..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
          >
            検索
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              クリア
            </button>
          )}
        </div>
      </form>

      <div className="text-sm text-gray-500 mb-2">全{total}件</div>

      {/* テーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">ID</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">ルアー名</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">メーカー</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">カテゴリー</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">長さ</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">重さ</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">シリーズ</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">状態</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  読み込み中...
                </td>
              </tr>
            ) : lures.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  データがありません
                </td>
              </tr>
            ) : (
              lures.map((lure) => (
                <tr key={lure.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{lure.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{lure.lure_name_ja}</div>
                    <div className="text-xs text-gray-500">{lure.lure_name_en}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {lure.lure_maker?.lure_maker_name_ja || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {lure.lure_category?.category_name_ja || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {lure.lure_length ? `${lure.lure_length}mm` : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {lure.lure_weight ? `${lure.lure_weight}g` : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {lure.lure_series_ja || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        lure.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {lure.is_available ? "公開" : "非公開"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/lures/${lure.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => setDeleteId(lure.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
          >
            前へ
          </button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
          >
            次へ
          </button>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">削除確認</h3>
            <p className="text-sm text-gray-600 mb-4">
              このルアーを削除しますか？この操作は取り消せません。
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
