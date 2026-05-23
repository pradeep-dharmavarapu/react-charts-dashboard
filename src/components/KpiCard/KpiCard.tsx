import { Link } from 'react-router-dom';
import { formatSignedValue, formatValue } from '../../data/formatters';
import type { KpiSummary } from '../../data/types';
import { SparklineChart } from '../charts/SparklineChart';
import { DeltaBadge } from '../ui/DeltaBadge';

interface KpiCardProps {
  summary: KpiSummary;
}

export function KpiCard({ summary }: KpiCardProps) {
  return (
    <article className="kpi-card">
      <Link to={`/kpi/${summary.id}`} aria-label={`Open ${summary.label} drill-down`}>
        <div className="kpi-card-header">
          <div>
            <h2>{summary.label}</h2>
            <p>{summary.description}</p>
          </div>
          <DeltaBadge delta={summary.qoqDeltaPct} higherIsBetter={summary.higherIsBetter} />
        </div>

        <div className="kpi-value-row">
          <strong>{formatValue(summary.currentValue, summary.symbol)}</strong>
          <span>{formatSignedValue(summary.qoqDelta, summary.symbol)} vs prior quarter</span>
        </div>

        <div className="sparkline" aria-hidden="true">
          <SparklineChart data={summary.trend} symbol={summary.symbol} />
        </div>
      </Link>
    </article>
  );
}
