import { useKpiStore } from '../store/useKpiStore';

export const useKpiData = () => ({
  status: useKpiStore((state) => state.status),
  error: useKpiStore((state) => state.error),
  rawRows: useKpiStore((state) => state.rawRows),
  dataset: useKpiStore((state) => state.dataset),
  summaries: useKpiStore((state) => state.summaries),
  loadData: useKpiStore((state) => state.loadData),
});
