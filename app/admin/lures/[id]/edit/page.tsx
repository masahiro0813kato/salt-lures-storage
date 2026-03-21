"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LureForm from "@/components/admin/LureForm";

export default function AdminLureEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [lure, setLure] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLure = async () => {
      const res = await fetch(`/api/admin/lures/${id}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        router.push("/admin/lures");
        return;
      }
      const data = await res.json();
      setLure(data);
      setIsLoading(false);
    };
    fetchLure();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!lure) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ルアー編集</h2>
      <LureForm
        initialData={{
          lure_id: (lure.lure_id as string) || "",
          lure_name_ja: (lure.lure_name_ja as string) || "",
          lure_name_en: (lure.lure_name_en as string) || "",
          lure_maker_id: (lure.lure_maker_id as number) || null,
          lure_category_id: (lure.lure_category_id as number) || null,
          lure_length: (lure.lure_length as number) || null,
          lure_weight: (lure.lure_weight as number) || null,
          lure_buoyancy: (lure.lure_buoyancy as string) || "",
          lure_action: (lure.lure_action as string) || "",
          lure_range_min: (lure.lure_range_min as number) || null,
          lure_range_max: (lure.lure_range_max as number) || null,
          attached_hook_size_1: (lure.attached_hook_size_1 as string) || "",
          attached_hook_size_2: (lure.attached_hook_size_2 as string) || "",
          attached_hook_size_3: (lure.attached_hook_size_3 as string) || "",
          attached_hook_size_4: (lure.attached_hook_size_4 as string) || "",
          attached_hook_size_5: (lure.attached_hook_size_5 as string) || "",
          attached_ring_size: (lure.attached_ring_size as string) || "",
          lure_series_ja: (lure.lure_series_ja as string) || "",
          lure_series_en: (lure.lure_series_en as string) || "",
          lure_information: (lure.lure_information as string) || "",
          lure_ref_url: (lure.lure_ref_url as string) || "",
          is_available: (lure.is_available as boolean) ?? true,
        }}
        lureId={parseInt(id, 10)}
        lureIdStr={(lure.lure_id as string) || ""}
        isEdit
      />
    </div>
  );
}
