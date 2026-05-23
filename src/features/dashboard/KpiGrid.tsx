import type { KpiSummary } from '../../data/types';
import { KpiCard } from './KpiCard';
import styles from './KpiGrid.module.css';

interface KpiGridProps {
  summaries: KpiSummary[];
}

export function KpiGrid({ summaries }: KpiGridProps) {
  return (
    <section className={styles.grid} aria-label="Executive KPI cards">
      {summaries.map((summary) => (
        <KpiCard key={summary.id} summary={summary} />
      ))}
    </section>
  );
}
