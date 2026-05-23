import { formatPct, formatSignedValue, formatValue } from '../../data/formatters';
import type { ComparisonRow, SymbolKind } from '../../data/types';
import styles from './DrillDown.module.css';

interface GrowthTableProps {
  comparison: ComparisonRow[];
  symbol: SymbolKind;
}

export function GrowthTable({ comparison, symbol }: GrowthTableProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeading}>
        <div>
          <h2>Growth Table</h2>
          <p>Current quarter versus prior quarter and prior year.</p>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.compactTable}`}>
          <caption className={styles.visuallyHidden}>Current-quarter KPI growth compared with prior quarter and prior year</caption>
          <thead>
            <tr>
              <th>Period</th>
              <th>Actual</th>
              <th>Growth</th>
              <th>Growth %</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{formatValue(row.currentValue, symbol)}</td>
                <td>{formatSignedValue(row.absoluteGrowth, symbol)}</td>
                <td>{formatPct(row.percentGrowth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
