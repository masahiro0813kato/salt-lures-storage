"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Maker {
  id: number;
  lure_maker_name_ja: string;
}

interface Category {
  id: number;
  category_name_ja: string;
}

interface LureFormData {
  lure_name_ja: string;
  lure_name_en: string;
  lure_maker_id: number | null;
  lure_category_id: number | null;
  lure_length: number | null;
  lure_weight: number | null;
  lure_buoyancy: string;
  lure_action: string;
  lure_range_min: number | null;
  lure_range_max: number | null;
  attached_hook_size_1: string;
  attached_hook_size_2: string;
  attached_hook_size_3: string;
  attached_hook_size_4: string;
  attached_hook_size_5: string;
  attached_ring_size: string;
  lure_series_ja: string;
  lure_series_en: string;
  lure_information: string;
  lure_ref_url: string;
  is_available: boolean;
}

interface LureFormProps {
  initialData?: Partial<LureFormData>;
  lureId?: number;
  isEdit?: boolean;
}

const defaultData: LureFormData = {
  lure_name_ja: "",
  lure_name_en: "",
  lure_maker_id: null,
  lure_category_id: null,
  lure_length: null,
  lure_weight: null,
  lure_buoyancy: "",
  lure_action: "",
  lure_range_min: null,
  lure_range_max: null,
  attached_hook_size_1: "",
  attached_hook_size_2: "",
  attached_hook_size_3: "",
  attached_hook_size_4: "",
  attached_hook_size_5: "",
  attached_ring_size: "",
  lure_series_ja: "",
  lure_series_en: "",
  lure_information: "",
  lure_ref_url: "",
  is_available: true,
};

export default function LureForm({ initialData, lureId, isEdit = false }: LureFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<LureFormData>({ ...defaultData, ...initialData });
  const [makers, setMakers] = useState<Maker[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      const [makersRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/options/makers"),
        fetch("/api/admin/options/categories"),
      ]);
      if (makersRes.ok) setMakers(await makersRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
    };
    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: value === "" ? null : parseFloat(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!form.lure_name_ja) {
      setError("ルアー名（日本語）は必須です");
      setIsSubmitting(false);
      return;
    }

    // 空文字列をnullに変換
    const body: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(form)) {
      body[key] = value === "" ? null : value;
    }

    const url = isEdit ? `/api/admin/lures/${lureId}` : "/api/admin/lures";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "保存に失敗しました");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/lures");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* 基本情報 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ルアー名（日本語）<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lure_name_ja"
                value={form.lure_name_ja}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ルアー名（英語）
              </label>
              <input
                type="text"
                name="lure_name_en"
                value={form.lure_name_en}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メーカー</label>
              <select
                name="lure_maker_id"
                value={form.lure_maker_id || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    lure_maker_id: e.target.value ? parseInt(e.target.value, 10) : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">選択してください</option>
                {makers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.lure_maker_name_ja}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
              <select
                name="lure_category_id"
                value={form.lure_category_id || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    lure_category_id: e.target.value ? parseInt(e.target.value, 10) : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">選択してください</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name_ja}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* スペック */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">スペック</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">長さ (mm)</label>
              <input type="number" name="lure_length" value={form.lure_length ?? ""} onChange={handleChange} step="0.1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">重さ (g)</label>
              <input type="number" name="lure_weight" value={form.lure_weight ?? ""} onChange={handleChange} step="0.1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">レンジMin (cm)</label>
              <input type="number" name="lure_range_min" value={form.lure_range_min ?? ""} onChange={handleChange} step="1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">レンジMax (cm)</label>
              <input type="number" name="lure_range_max" value={form.lure_range_max ?? ""} onChange={handleChange} step="1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">浮力</label>
              <input type="text" name="lure_buoyancy" value={form.lure_buoyancy} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">アクション</label>
              <input type="text" name="lure_action" value={form.lure_action} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>
        </div>

        {/* フック・リング */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">フック・リング</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">フック1</label>
              <input type="text" name="attached_hook_size_1" value={form.attached_hook_size_1} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">フック2</label>
              <input type="text" name="attached_hook_size_2" value={form.attached_hook_size_2} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">フック3</label>
              <input type="text" name="attached_hook_size_3" value={form.attached_hook_size_3} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">フック4</label>
              <input type="text" name="attached_hook_size_4" value={form.attached_hook_size_4} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">フック5</label>
              <input type="text" name="attached_hook_size_5" value={form.attached_hook_size_5} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">リングサイズ</label>
              <input type="text" name="attached_ring_size" value={form.attached_ring_size} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>
        </div>

        {/* シリーズ */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">シリーズ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">シリーズ名（日本語）</label>
              <input type="text" name="lure_series_ja" value={form.lure_series_ja} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">シリーズ名（英語）</label>
              <input type="text" name="lure_series_en" value={form.lure_series_en} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>
        </div>

        {/* 説明・参照URL */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">その他</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">説明文</label>
              <textarea
                name="lure_information"
                value={form.lure_information}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">参照URL</label>
              <input type="url" name="lure_ref_url" value={form.lure_ref_url} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_available"
                id="is_available"
                checked={form.is_available}
                onChange={handleChange}
                className="rounded"
              />
              <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                公開する
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex items-center justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/lures")}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {isSubmitting ? "保存中..." : isEdit ? "更新する" : "作成する"}
        </button>
      </div>
    </form>
  );
}
