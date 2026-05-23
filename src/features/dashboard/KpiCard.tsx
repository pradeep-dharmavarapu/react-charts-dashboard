import { Link } from 'react-router-dom';
import { formatPct, formatSignedValue, formatValue } from '../../data/formatters';
import type { KpiSummary } from '../../data/types';
import { SparklineChart } from '../../shared/charts/SparklineChart';
import { DeltaBadge } from '../../shared/ui/DeltaBadge';
import styles from './KpiCard.module.css';

interface KpiCardProps {
  summary: KpiSummary;
}

export function KpiCard({ summary }: KpiCardProps) {
  return (
    <article className={styles.card}>
      <Link className={styles.link} to={`/kpi/${summary.id}`} aria-label={`Open ${summary.label} drill-down`}>
        <div className={styles.header}>
          <div>
            <h2>{summary.label}</h2>
            <p>{summary.description}</p>
          </div>
          <DeltaBadge delta={summary.qoqDeltaPct} higherIsBetter={summary.higherIsBetter} />
        </div>

        <div className={styles.valueRow}>
          <strong>{formatValue(summary.currentValue, summary.symbol)}</strong>
          <span>{formatSignedValue(summary.qoqDelta, summary.symbol)} vs prior quarter</span>
        </div>

        <dl className={styles.comparisonList}>
          <div>
            <dt>Prior quarter</dt>
            <dd>{formatValue(summary.priorQtrValue, summary.symbol)}</dd>
          </div>
          <div>
            <dt>YoY</dt>
            <dd>{formatPct(summary.yoyDeltaPct)}</dd>
          </div>
        </dl>

        <div className={styles.sparkline} aria-hidden="true">
          <SparklineChart data={summary.trend} symbol={summary.symbol} />
        </div>
      </Link>
    </article>
  );
}
