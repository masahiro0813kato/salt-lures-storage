"use client";

import LureDetailImage from "./LureDetailImage";
import type { LureWithRelations } from "@/types/database";

interface LureDetailPanelProps {
  lure: LureWithRelations;
  horizontal?: boolean;
}

function nl2br(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/\n/g, "<br />");
}

function SpecSection({ lure }: { lure: LureWithRelations }) {
  return (
    <>
      {/* カテゴリー */}
      <div className="mb-6">
        <h3 className="text-sm text-text-tertiary mb-1">Type</h3>
        <div className="text-lg mb-1">
          {lure.lure_category?.category_name_ja}
        </div>
        <div className="text-sm text-text-secondary">
          {lure.lure_action}
        </div>
      </div>

      {/* フックサイズ */}
      <div className="mb-6">
        <h3 className="text-sm text-text-tertiary mb-1">Hook Size</h3>
        <div className="text-base">
          <span className="text-xs font-bold text-text-tertiary">F・</span>
          {lure.attached_hook_size_1 && <span>{lure.attached_hook_size_1}</span>}
          {lure.attached_hook_size_2 && (
            <>
              <span className="text-xs font-bold text-text-tertiary">・</span>
              <span>{lure.attached_hook_size_2}</span>
            </>
          )}
          {lure.attached_hook_size_3 && (
            <>
              <span className="text-xs font-bold text-text-tertiary">・</span>
              <span>{lure.attached_hook_size_3}</span>
            </>
          )}
          {lure.attached_hook_size_4 && (
            <>
              <span className="text-xs font-bold text-text-tertiary">・</span>
              <span>{lure.attached_hook_size_4}</span>
            </>
          )}
          {lure.attached_hook_size_5 && (
            <>
              <span className="text-xs font-bold text-text-tertiary">・</span>
              <span>{lure.attached_hook_size_5}</span>
            </>
          )}
          <span className="text-xs font-bold text-text-tertiary">・R</span>
        </div>
      </div>

      {/* その他のスペック */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-6">
        <div>
          <h3 className="text-sm text-text-tertiary mb-1">Ring Size</h3>
          <div className="text-lg">{lure.attached_ring_size}</div>
        </div>
        <div>
          <h3 className="text-sm text-text-tertiary mb-1">Length</h3>
          <div className="text-lg">
            {lure.lure_length}
            <span className="text-sm ml-1">mm</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-text-tertiary mb-1">Weight</h3>
          <div className="text-lg">
            {lure.lure_weight}
            <span className="text-sm ml-1">g</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-text-tertiary mb-1">Buoyancy</h3>
          <div className="text-lg">{lure.lure_buoyancy}</div>
        </div>
        <div>
          <h3 className="text-sm text-text-tertiary mb-1">Range</h3>
          <div className="text-lg">
            {lure.lure_range_min}-{lure.lure_range_max}
            <span className="text-sm ml-1">cm</span>
          </div>
        </div>
      </div>
    </>
  );
}

// 1024px以上: 横並びレイアウト
function HorizontalLayout({ lure }: { lure: LureWithRelations; }) {
  return (
    <div className="h-full flex bg-bg-primary text-white">
      {/* 左: 画像 + タイトル */}
      <div className="w-1/2 flex flex-col">
        <LureDetailImage
          lureId={lure.lure_id}
          lureName={lure.lure_name_ja}
          bgColors={lure.bg_colors}
        />
        <div className="px-6 py-4">
          <div className="text-lg leading-none mb-3">
            {lure.lure_maker?.lure_maker_name_en}
          </div>
          <h2 className="text-2xl leading-tight">{lure.lure_name_ja}</h2>
          <div className="text-base text-text-secondary leading-tight">
            {lure.lure_name_en}
          </div>
        </div>
      </div>

      {/* 右: スペック + 説明文 */}
      <div className="w-1/2 overflow-y-auto px-6 py-6">
        <SpecSection lure={lure} />

        {lure.lure_information && (
          <div className="mt-6 pt-6 border-t border-text-tertiary">
            <div
              className="whitespace-pre-line text-sm"
              dangerouslySetInnerHTML={{ __html: nl2br(lure.lure_information) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 768-1024px: 縦並びレイアウト
function VerticalLayout({ lure }: { lure: LureWithRelations }) {
  return (
    <div className="h-full overflow-y-auto">
      <LureDetailImage
        lureId={lure.lure_id}
        lureName={lure.lure_name_ja}
      />

      <section className="relative bg-bg-primary z-50 px-4 py-8 text-white">
        <div className="pb-8">
          <div className="text-xl leading-none mb-6">
            {lure.lure_maker?.lure_maker_name_en}
          </div>
          <h2 className="text-2xl leading-tight">{lure.lure_name_ja}</h2>
          <div className="text-base text-text-secondary leading-tight">
            {lure.lure_name_en}
          </div>
        </div>

        <div className="border-y-[0.5px] border-text-tertiary py-8 mb-8 leading-none text-xl">
          <SpecSection lure={lure} />
        </div>

        <div
          className="whitespace-pre-line text-sm"
          dangerouslySetInnerHTML={{ __html: nl2br(lure.lure_information) }}
        />
      </section>
    </div>
  );
}

export default function LureDetailPanel({ lure, horizontal = false }: LureDetailPanelProps) {
  if (horizontal) {
    return <HorizontalLayout lure={lure} />;
  }
  return <VerticalLayout lure={lure} />;
}
