import { parseCsvRows } from './parser';
import type { RawRow } from './types';

export const loadCsvRows = async (): Promise<RawRow[]> => {
  const response = await fetch('/kpi_dataset.csv');

  if (!response.ok) {
    throw new Error(`Failed to load dataset (${response.status})`);
  }

  return parseCsvRows(await response.text());
};
