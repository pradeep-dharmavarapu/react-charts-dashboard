import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useKpiData } from '../hooks/useKpiData';
import { LoadingShell } from '../shared/ui/LoadingShell';

const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const DrillDownPage = lazy(() =>
  import('../features/drill-down/DrillDownPage').then((module) => ({ default: module.DrillDownPage })),
);

export function App() {
  const { loadData } = useKpiData();

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <Suspense fallback={<LoadingShell />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/kpi/:kpiId" element={<DrillDownPage />} />
      </Routes>
    </Suspense>
  );
}
