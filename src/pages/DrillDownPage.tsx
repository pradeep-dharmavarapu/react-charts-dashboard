import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { DrillDown } from '../components/DrillDown/DrillDown';
import { LoadingShell } from '../components/ui/LoadingShell';
import { buildDrillDownData, isKpiId } from '../data/transforms';
import type { DimensionKey } from '../data/types';
import { useKpiData } from '../hooks/useKpiData';

export function DrillDownPage() {
  const { kpiId } = useParams();
  const navigate = useNavigate();
  const { status, error, rawRows } = useKpiData();
  const [dimension, setDimension] = useState<DimensionKey>('THEATER');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate('/');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  const drillData = useMemo(() => {
    if (!isKpiId(kpiId)) return null;
    return buildDrillDownData(kpiId, rawRows, dimension);
  }, [dimension, kpiId, rawRows]);

  if (!isKpiId(kpiId)) return <Navigate to="/" replace />;
  if (status === 'loading' || status === 'idle') return <LoadingShell message="Preparing drill-down" />;

  if (status === 'error') {
    return (
      <main className="app-shell">
        <section className="state-shell error-state">
          <h1>Unable to load drill-down</h1>
          <p>{error}</p>
          <Link className="primary-link" to="/">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  if (!drillData) return <Navigate to="/" replace />;

  return <DrillDown data={drillData} dimension={dimension} onDimensionChange={setDimension} />;
}
