import LureCard from './LureCard';
import type { LureWithRelations } from '@/types/database';

interface LureListProps {
  lures: LureWithRelations[];
  total?: number;
}

export default function LureList({ lures, total }: LureListProps) {
  if (!lures || lures.length === 0) {
    return (
      <section>
        <div className="text-white text-sm flex justify-center py-16">
          検索条件に該当するルアーはありません
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      {total && (
        <div className="text-text-secondary text-sm mb-1">
          全{total}件
        </div>
      )}

      {lures.map((lure, index) => (
        <LureCard key={lure.id} lure={lure} priority={index < 2} />
      ))}
    </section>
  );
}
