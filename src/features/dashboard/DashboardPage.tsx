import { Compass } from 'lucide-react';
import { useKpiData } from '../../hooks/useKpiData';
import { LoadingShell } from '../../shared/ui/LoadingShell';
import shellStyles from '../../shared/ui/Shell.module.css';
import { StateShell } from '../../shared/ui/StateShell';
import stateStyles from '../../shared/ui/StateShell.module.css';
import { KpiGrid } from './KpiGrid';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { status, error, summaries, loadData } = useKpiData();

  if (status === 'loading' || status === 'idle') return <LoadingShell />;

  if (status === 'error') {
    return (
      <StateShell
        title="Unable to load dashboard"
        message={error}
        tone="error"
        action={
          <button className={stateStyles.primaryButton} type="button" onClick={() => void loadData()}>
            Try again
          </button>
        }
      />
    );
  }

  if (summaries.length === 0) {
    return (
      <StateShell
        title="No KPI data available"
        message="The dataset loaded, but it did not contain enough quarter data to build the dashboard."
      />
    );
  }

  return (
    <main className={shellStyles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.brandKicker}>
            <span className={styles.brandMark} aria-hidden="true">
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
