import { formatPct, formatValue } from '../../data/formatters';
import type { KpiSummary, NormalizedKpiDataset } from '../../data/types';
import styles from './DashboardPage.module.css';

interface DashboardSummaryProps {
  dataset: NormalizedKpiDataset | null;
  summaries: KpiSummary[];
}

const getSummary = (summaries: KpiSummary[], id: KpiSummary['id']) =>
  summaries.find((summary) => summary.id === id);

export function DashboardSummary({ dataset, summaries }: DashboardSummaryProps) {
  const bookings = getSummary(summaries, 'bookings');
  const pipeline = getSummary(summaries, 'open-pipeline');
  const winRate = getSummary(summaries, 'win-rate');
  const improvingCount = summaries.filter((summary) => summary.qoqDeltaPct >= 0).length;

  return (
    <section className={styles.summaryStrip} aria-label="Dashboard snapshot">
      <div>
        <span>Current quarter</span>
        <strong>{dataset?.currentQuarter?.name ?? 'Current'}</strong>
      </div>
      {bookings && (
        <div>
          <span>Bookings</span>
          <strong>{formatValue(bookings.currentValue, bookings.symbol)}</strong>
          <small>{formatPct(bookings.qoqDeltaPct)} QoQ</small>
        </div>
      )}
      {pipeline && (
        <div>
          <span>Open pipeline</span>
          <strong>{formatValue(pipeline.currentValue, pipeline.symbol)}</strong>
          <small>{formatPct(pipeline.qoqDeltaPct)} QoQ</small>
        </div>
      )}
      {winRate && (
        <div>
          <span>Win rate</span>
          <strong>{formatValue(winRate.currentValue, winRate.symbol)}</strong>
          <small>{formatPct(winRate.qoqDeltaPct)} QoQ</small>
        </div>
      )}
      <div>
        <span>KPIs improving QoQ</span>
        <strong>{improvingCount}/{summaries.length}</strong>
      </div>
    </section>
  );
}
