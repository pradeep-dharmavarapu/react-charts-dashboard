import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { formatValue } from '../../data/formatters';
import type { SymbolKind } from '../../data/types';
import styles from './SparklineChart.module.css';

interface SparklineChartProps {
  data: Array<{ quarter: string; value: number }>;
  symbol: SymbolKind;
}

const SparklineTooltip = ({ active, payload, label, symbol }: TooltipProps<ValueType, NameType> & { symbol: SymbolKind }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className={styles.tooltip}>
      <span>{label}</span>
      <strong>{formatValue(Number(payload[0].value), symbol)}</strong>
    </div>
  );
};

export function SparklineChart({ data, symbol }: SparklineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={56}>
      <LineChart data={data} margin={{ top: 8, right: 4, bottom: 8, left: 4 }}>
        <Tooltip content={(props) => <SparklineTooltip {...props} symbol={symbol} />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="currentColor"
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
