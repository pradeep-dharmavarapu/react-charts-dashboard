import type { SymbolKind } from '../../data/types';
import { TrendLineChart } from '../../shared/charts/TrendLineChart';
import styles from './DrillDown.module.css';

interface TrendPanelProps {
  timeSeries: Array<{ quarter: string; value: number }>;
  symbol: SymbolKind;
}

export function TrendPanel({ timeSeries, symbol }: TrendPanelProps) {
  return (
    <div className={`${styles.panel} ${styles.trendPanel}`}>
      <div className={styles.panelHeading}>
        <div>
          <h2>Quarterly Trend</h2>
          <p>Five-quarter actuals from the dataset.</p>
        </div>
      </div>
      <div role="img" aria-label="Five-quarter KPI trend chart">
        <TrendLineChart data={timeSeries} symbol={symbol} />
      </div>
    </div>
  );
}
