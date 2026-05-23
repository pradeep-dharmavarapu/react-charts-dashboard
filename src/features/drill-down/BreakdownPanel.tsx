import { formatPct, formatSignedValue, formatValue } from '../../data/formatters';
import type { BreakdownRow, DimensionKey, SymbolKind } from '../../data/types';
import { DimensionToggle } from '../dimensions/DimensionToggle';
import { DIMENSION_LABELS } from '../dimensions/dimensionConfig';
import { BreakdownBarChart } from '../../shared/charts/BreakdownBarChart';
import styles from './DrillDown.module.css';

interface BreakdownPanelProps {
  breakdown: BreakdownRow[];
  dimension: DimensionKey;
  onDimensionChange: (dimension: DimensionKey) => void;
  symbol: SymbolKind;
}

export function BreakdownPanel({
  breakdown,
  dimension,
  onDimensionChange,
  symbol,
}: BreakdownPanelProps) {
  const dimensionLabel = DIMENSION_LABELS[dimension];
  const topContributor = breakdown[0];

  return (
    <div className={`${styles.panel} ${styles.panelFull}`}>
      <div className={`${styles.panelHeading} ${styles.splitHeading}`}>
        <div>
          <h2>Breakdown by {dimensionLabel}</h2>
          <p>Current quarter contribution with QoQ growth.</p>
        </div>
        <DimensionToggle value={dimension} onChange={onDimensionChange} />
      </div>
      {topContributor && (
        <div className={styles.contributorCallout}>
          <span>Largest contributor</span>
          <strong>{topContributor.name}</strong>
          <p>
            {formatValue(topContributor.value, symbol)} in current-quarter actuals,
            {' '}
            {formatSignedValue(topContributor.absoluteGrowth, symbol)} QoQ.
          </p>
        </div>
      )}
      <div
        className={styles.breakdownChart}
        role="img"
        aria-label={`Current-quarter contribution chart by ${dimensionLabel}`}
      >
        <BreakdownBarChart data={breakdown} symbol={symbol} />
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.visuallyHidden}>Current-quarter breakdown by {dimensionLabel} with quarter-over-quarter and year-over-year growth</caption>
          <thead>
            <tr>
              <th>{dimensionLabel}</th>
              <th>Actual</th>
              <th>QoQ growth</th>
              <th>QoQ growth %</th>
              <th>YoY growth</th>
              <th>YoY growth %</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{formatValue(row.value, symbol)}</td>
                <td>{formatSignedValue(row.absoluteGrowth, symbol)}</td>
                <td>{formatPct(row.percentGrowth)}</td>
                <td>{formatSignedValue(row.yoyAbsoluteGrowth, symbol)}</td>
                <td>{formatPct(row.yoyPercentGrowth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
