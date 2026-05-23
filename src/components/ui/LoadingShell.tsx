interface LoadingShellProps {
  message?: string;
}

export function LoadingShell({ message = 'Loading KPI data' }: LoadingShellProps) {
  return (
    <main className="app-shell">
      <section className="state-shell" aria-live="polite">
        <div className="spinner" />
        <p>{message}</p>
      </section>
    </main>
  );
}
