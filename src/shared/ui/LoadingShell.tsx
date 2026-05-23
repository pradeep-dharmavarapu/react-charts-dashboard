import shellStyles from './Shell.module.css';
import styles from './StateShell.module.css';

interface LoadingShellProps {
  message?: string;
}

export function LoadingShell({ message = 'Loading KPI data' }: LoadingShellProps) {
  return (
    <main className={shellStyles.shell}>
      <section className={styles.stateShell} aria-live="polite">
        <div className={styles.spinner} />
        <p>{message}</p>
      </section>
    </main>
  );
}
