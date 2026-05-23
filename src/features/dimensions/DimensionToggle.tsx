import type { DimensionKey } from '../../data/types';
import { DIMENSIONS } from './dimensionConfig';
import styles from './DimensionToggle.module.css';

interface DimensionToggleProps {
  value: DimensionKey;
  onChange: (value: DimensionKey) => void;
}

export function DimensionToggle({ value, onChange }: DimensionToggleProps) {
  return (
    <div className={styles.control} role="radiogroup" aria-label="Breakdown dimension">
      {DIMENSIONS.map((dimension) => (
        <button
          key={dimension.key}
          type="button"
          role="radio"
          className={value === dimension.key ? `${styles.button} ${styles.active}` : styles.button}
          aria-checked={value === dimension.key}
          onClick={() => onChange(dimension.key)}
        >
          {dimension.label}
        </button>
      ))}
    </div>
  );
}
