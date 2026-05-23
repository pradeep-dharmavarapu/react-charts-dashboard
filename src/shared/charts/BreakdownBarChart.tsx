import type { CSSProperties } from 'react';
import { formatValue } from '../../data/formatters';
import type { BreakdownRow, SymbolKind } from '../../data/types';
import styles from './BreakdownBarChart.module.css';

interface BreakdownBarChartProps {
  data: BreakdownRow[];
  symbol: SymbolKind;
}

export function BreakdownBarChart({ data, symbol }: BreakdownBarChartProps) {
  const maxValue = Math.max(...data.map((row) => row.value), 0);

  return (
    <div className={styles.meterList}>
      {data.map((row) => {
        const width = maxValue > 0 ? `${Math.max((row.value / maxValue) * 100, 2)}%` : '0%';
        const rowStyle = { '--bar-width': width } as CSSProperties;

        return (
          <div className={styles.meterRow} key={row.name} style={rowStyle}>
            <span className={styles.meterLabel}>{row.name}</span>
            <div className={styles.meterPlot}>
              <span className={styles.meterFill} style={{ width }} />
              <span className={styles.meterValue}>{formatValue(row.value, symbol)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
