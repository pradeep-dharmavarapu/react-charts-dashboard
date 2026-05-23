import type { RawRow } from './types';

export const filterByKpi = (rows: RawRow[], kpi: RawRow['KPI']): RawRow[] =>
  rows.filter((row) => row.KPI === kpi);

export const sumRows = (rows: RawRow[]): number =>
  rows.reduce((sum, row) => sum + row.KPI_VALUE, 0);

export const sumKpi = (rows: RawRow[], kpi: RawRow['KPI']): number =>
  sumRows(filterByKpi(rows, kpi));

export const distinctCount = (
  rows: RawRow[],
  key: keyof Pick<RawRow, 'OPPORTUNITY_ID' | 'ACCOUNT_ID'>,
): number => new Set(rows.map((row) => row[key]).filter(Boolean)).size;

export const groupRowsByQuarter = (rows: RawRow[]): Map<number, RawRow[]> => {
  const grouped = new Map<number, RawRow[]>();

  rows.forEach((row) => {
    const quarterRows = grouped.get(row.FISCAL_QUARTER_KEY) ?? [];
    quarterRows.push(row);
    grouped.set(row.FISCAL_QUARTER_KEY, quarterRows);
  });

  return grouped;
};

export const getSortedQuarters = (rows: RawRow[]): Array<{ key: number; name: string }> => {
  const quarterMap = new Map<number, string>();
  rows.forEach((row) => quarterMap.set(row.FISCAL_QUARTER_KEY, row.FISCAL_QUARTER_NAME));

  return Array.from(quarterMap.entries())
    .map(([key, name]) => ({ key, name }))
    .sort((a, b) => a.key - b.key);
};
