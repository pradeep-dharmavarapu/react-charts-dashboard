import { Compass } from 'lucide-react';
import { KpiGrid } from '../components/KpiGrid/KpiGrid';
import { LoadingShell } from '../components/ui/LoadingShell';
import { useKpiData } from '../hooks/useKpiData';

export function GridPage() {
  const { status, error, summaries } = useKpiData();

  if (status === 'loading' || status === 'idle') return <LoadingShell />;

  if (status === 'error') {
    return (
      <main className="app-shell">
        <section className="state-shell error-state">
          <h1>Unable to load dashboard</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (summaries.length === 0) {
    return (
      <main className="app-shell">
        <section className="state-shell">
          <h1>No KPI data available</h1>
          <p>The dataset loaded, but it did not contain enough quarter data to build the dashboard.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="brand-kicker">
            <span className="brand-mark" aria-hidden="true">
              <Compass size={18} />
            </span>
            NorthStar Analytics
          </p>
          <h1>Executive KPI Dashboard</h1>
          <p>Seven current-quarter KPIs with QoQ movement and five-quarter context.</p>
        </div>
      </header>
      <KpiGrid summaries={summaries} />
    </main>
  );
}
