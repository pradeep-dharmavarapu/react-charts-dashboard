import type { DimensionKey } from '../../data/types';

const dimensions: Array<{ key: DimensionKey; label: string }> = [
  { key: 'THEATER', label: 'Theater' },
  { key: 'PRODUCT', label: 'Product' },
  { key: 'SEGMENT', label: 'Segment' },
];

interface DimensionToggleProps {
  value: DimensionKey;
  onChange: (value: DimensionKey) => void;
}

export function DimensionToggle({ value, onChange }: DimensionToggleProps) {
  return (
    <div className="segmented-control" aria-label="Breakdown dimension">
      {dimensions.map((dimension) => (
        <button
          key={dimension.key}
          type="button"
          className={value === dimension.key ? 'active' : ''}
          onClick={() => onChange(dimension.key)}
        >
          {dimension.label}
        </button>
      ))}
    </div>
  );
}
