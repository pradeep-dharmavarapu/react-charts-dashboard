import { create } from 'zustand';
import { loadCsvRows } from '../data/loader';
import { normalizeDataset } from '../data/normalizeDataset';
import { buildKpiSummaries } from '../data/transforms';
import type { KpiSummary, NormalizedKpiDataset, RawRow } from '../data/types';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface KpiStore {
  status: LoadStatus;
  error: string | null;
  rawRows: RawRow[];
  dataset: NormalizedKpiDataset | null;
  summaries: KpiSummary[];
  loadData: () => Promise<void>;
}

export const useKpiStore = create<KpiStore>((set, get) => ({
  status: 'idle',
  error: null,
  rawRows: [],
  dataset: null,
  summaries: [],
  loadData: async () => {
    if (get().status === 'loading' || get().status === 'success') return;

    set({ status: 'loading', error: null });

    try {
      const rawRows = await loadCsvRows();
      const dataset = normalizeDataset(rawRows);
      set({
        rawRows,
        dataset,
        summaries: buildKpiSummaries(dataset),
        status: 'success',
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unable to load dashboard data',
      });
    }
  },
}));
