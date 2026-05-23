import { formatPct, formatSignedValue, formatValue } from '../../data/formatters';
import type { ComparisonRow, SymbolKind } from '../../data/types';
import styles from './DrillDown.module.css';

interface GrowthTableProps {
  comparison: ComparisonRow[];
  symbol: SymbolKind;
}

export function GrowthTable({ comparison, symbol }: GrowthTableProps) {
  return (
    <div className={`${styles.panel} ${styles.growthPanel}`}>
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
            {comparison.map((row) => {
              const growthClass = row.absoluteGrowth >= 0 ? styles.positiveCell : styles.negativeCell;
              const percentClass = row.percentGrowth >= 0 ? styles.positiveCell : styles.negativeCell;

              return (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td className={styles.numericCell}>{formatValue(row.currentValue, symbol)}</td>
                  <td className={`${styles.numericCell} ${growthClass}`}>
                    {formatSignedValue(row.absoluteGrowth, symbol)}
                  </td>
                  <td className={`${styles.numericCell} ${percentClass}`}>{formatPct(row.percentGrowth)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
