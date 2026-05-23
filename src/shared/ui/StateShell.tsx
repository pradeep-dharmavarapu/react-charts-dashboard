import type { ReactNode } from 'react';
import shellStyles from './Shell.module.css';
import styles from './StateShell.module.css';

interface StateShellProps {
  title: string;
  message?: string | null;
  tone?: 'default' | 'error';
  action?: ReactNode;
}

export function StateShell({ title, message, tone = 'default', action }: StateShellProps) {
  const className = tone === 'error' ? `${styles.stateShell} ${styles.errorState}` : styles.stateShell;

  return (
    <main className={shellStyles.shell}>
      <section className={className}>
        <h1>{title}</h1>
        {message && <p>{message}</p>}
        {action && <div className={styles.actions}>{action}</div>}
      </section>
    </main>
  );
}
