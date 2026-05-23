import type { DimensionKey, DrillDownData } from '../../data/types';
import shellStyles from '../../shared/ui/Shell.module.css';
import { BreakdownPanel } from './BreakdownPanel';
import { DrillDownHeader } from './DrillDownHeader';
import styles from './DrillDown.module.css';
import { GrowthTable } from './GrowthTable';
import { TrendPanel } from './TrendPanel';

interface DrillDownViewProps {
  data: DrillDownData;
  dimension: DimensionKey;
  onDimensionChange: (dimension: DimensionKey) => void;
}

export function DrillDownView({ data, dimension, onDimensionChange }: DrillDownViewProps) {
  return (
    <main className={`${shellStyles.shell} ${shellStyles.detailShell}`}>
      <DrillDownHeader data={data} />

      <section className={styles.grid}>
        <TrendPanel timeSeries={data.timeSeries} symbol={data.definition.symbol} />
        <GrowthTable comparison={data.comparison} symbol={data.definition.symbol} />
        <BreakdownPanel
          breakdown={data.breakdown}
          dimension={dimension}
          onDimensionChange={onDimensionChange}
          symbol={data.definition.symbol}
        />
      </section>
    </main>
  );
}
