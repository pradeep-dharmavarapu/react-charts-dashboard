import { create } from 'zustand';
import { loadCsvRows } from '../data/loader';
import { buildKpiSummaries } from '../data/transforms';
import type { KpiSummary, RawRow } from '../data/types';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface KpiStore {
  status: LoadStatus;
  error: string | null;
  rawRows: RawRow[];
  summaries: KpiSummary[];
  loadData: () => Promise<void>;
}

export const useKpiStore = create<KpiStore>((set, get) => ({
  status: 'idle',
  error: null,
  rawRows: [],
  summaries: [],
  loadData: async () => {
    if (get().status === 'loading' || get().status === 'success') return;

    set({ status: 'loading', error: null });

    try {
      const rawRows = await loadCsvRows();
      set({
        rawRows,
        summaries: buildKpiSummaries(rawRows),
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
