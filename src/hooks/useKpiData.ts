import { useKpiStore } from '../store/useKpiStore';

export const useKpiData = () => ({
  status: useKpiStore((state) => state.status),
  error: useKpiStore((state) => state.error),
  rawRows: useKpiStore((state) => state.rawRows),
  summaries: useKpiStore((state) => state.summaries),
  loadData: useKpiStore((state) => state.loadData),
});
