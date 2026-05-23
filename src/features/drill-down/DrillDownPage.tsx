import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { buildDrillDownData, isKpiId } from '../../data/transforms';
import type { DimensionKey } from '../../data/types';
import { useKpiData } from '../../hooks/useKpiData';
import { useEscapeNavigation } from '../../shared/hooks/useEscapeNavigation';
import { LoadingShell } from '../../shared/ui/LoadingShell';
import { StateShell } from '../../shared/ui/StateShell';
import stateStyles from '../../shared/ui/StateShell.module.css';
import { DrillDownView } from './DrillDownView';

export function DrillDownPage() {
  const { kpiId } = useParams();
  const navigate = useNavigate();
  const { status, error, dataset, loadData } = useKpiData();
  const [dimension, setDimension] = useState<DimensionKey>('THEATER');

  useEscapeNavigation(navigate, '/');

  const drillData = useMemo(() => {
    if (!isKpiId(kpiId) || !dataset) return null;
    return buildDrillDownData(kpiId, dataset, dimension);
  }, [dataset, dimension, kpiId]);

  if (!isKpiId(kpiId)) return <Navigate to="/" replace />;
  if (status === 'loading' || status === 'idle') return <LoadingShell message="Preparing drill-down" />;

  if (status === 'error') {
    return (
      <StateShell
        title="Unable to load drill-down"
        message={error}
        tone="error"
        action={
          <>
            <button className={stateStyles.primaryButton} type="button" onClick={() => void loadData()}>
              Try again
            </button>
            <Link className={stateStyles.primaryLink} to="/">Back to dashboard</Link>
          </>
        }
      />
    );
  }

  if (!drillData) return <Navigate to="/" replace />;

  return <DrillDownView data={drillData} dimension={dimension} onDimensionChange={setDimension} />;
}
