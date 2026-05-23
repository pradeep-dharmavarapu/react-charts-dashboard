import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPct, formatSignedValue, formatValue } from '../../data/formatters';
import type { DrillDownData } from '../../data/types';
import { useFocusOnMount } from '../../shared/hooks/useFocusOnMount';
import { DeltaBadge } from '../../shared/ui/DeltaBadge';
import styles from './DrillDown.module.css';

interface DrillDownHeaderProps {
  data: DrillDownData;
}

export function DrillDownHeader({ data }: DrillDownHeaderProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const currentValue = data.comparison[0]?.currentValue ?? 0;
  const qoq = data.comparison.find((row) => row.label === 'QoQ');
  const yoy = data.comparison.find((row) => row.label === 'YoY');
  const topContributor = data.breakdown[0];
  const qoqDirection = qoq && qoq.absoluteGrowth >= 0 ? 'up' : 'down';
  const insight = qoq
    ? `${data.definition.label} is ${qoqDirection} ${formatPct(Math.abs(qoq.percentGrowth))} QoQ in ${data.currentQuarterName}${
        topContributor ? `, led by ${topContributor.name}` : ''
      }.`
    : `${data.definition.label} performance for ${data.currentQuarterName}.`;

  return (
    <section className={styles.header} aria-labelledby="detail-title">
      <Link className={styles.backLink} to="/">
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </Link>

      <div className={styles.titleRow}>
        <div>
          <p className={styles.eyebrow}>{data.currentQuarterName}</p>
          <h1 id="detail-title" ref={headingRef} tabIndex={-1}>{data.definition.label}</h1>
          <p>{data.definition.description}</p>
        </div>
        <strong>{formatValue(currentValue, data.definition.symbol)}</strong>
      </div>

      <div className={styles.metricStrip} aria-label="Comparison summary">
        {qoq && (
          <div>
            <span>QoQ actual growth</span>
            <strong>{formatSignedValue(qoq.absoluteGrowth, data.definition.symbol)}</strong>
            <DeltaBadge delta={qoq.percentGrowth} higherIsBetter={data.definition.higherIsBetter} />
          </div>
        )}
        {yoy && (
          <div>
            <span>YoY actual growth</span>
            <strong>{formatSignedValue(yoy.absoluteGrowth, data.definition.symbol)}</strong>
            <DeltaBadge delta={yoy.percentGrowth} higherIsBetter={data.definition.higherIsBetter} label="YoY" />
          </div>
        )}
      </div>

      <p className={styles.insight}>{insight}</p>
    </section>
  );
}
