import type { KpiSummary } from '../../data/types';
import { KpiCard } from '../KpiCard/KpiCard';

interface KpiGridProps {
  summaries: KpiSummary[];
}

export function KpiGrid({ summaries }: KpiGridProps) {
  return (
    <section className="kpi-grid" aria-label="Executive KPI cards">
      {summaries.map((summary) => (
        <KpiCard key={summary.id} summary={summary} />
      ))}
    </section>
  );
}
