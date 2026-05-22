import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useKpiData } from './hooks/useKpiData';
import { DrillDownPage } from './pages/DrillDownPage';
import { GridPage } from './pages/GridPage';

export function App() {
  const { loadData } = useKpiData();

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <Routes>
      <Route path="/" element={<GridPage />} />
      <Route path="/kpi/:kpiId" element={<DrillDownPage />} />
    </Routes>
  );
}
