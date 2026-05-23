import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { formatPct } from '../../data/formatters';
import styles from './DeltaBadge.module.css';

interface DeltaBadgeProps {
  delta: number;
  higherIsBetter: boolean;
  label?: string;
}

export function DeltaBadge({ delta, higherIsBetter, label = 'QoQ' }: DeltaBadgeProps) {
  const isFlat = delta === 0;
  const isPositive = delta > 0;
  const isGood = isFlat || isPositive === higherIsBetter;
  const toneClass = isFlat ? styles.neutral : isGood ? styles.positive : styles.negative;
  const className = `${styles.badge} ${toneClass}`;
  const Icon = isFlat ? ArrowRight : isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={className} aria-label={`${label} ${formatPct(delta)}`}>
      <Icon size={16} aria-hidden="true" />
      {label} {formatPct(delta)}
    </span>
  );
}
