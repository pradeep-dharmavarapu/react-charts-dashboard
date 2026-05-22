import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatValue } from '../../data/formatters';
import type { SymbolKind } from '../../data/types';

interface TrendLineChartProps {
  data: Array<{ quarter: string; value: number }>;
  symbol: SymbolKind;
}

export function TrendLineChart({ data, symbol }: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 20, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="quarter" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatValue(Number(value), symbol)} width={72} />
        <Tooltip
          formatter={(value) => [formatValue(Number(value), symbol), 'Actual']}
          contentStyle={{ borderRadius: 8, border: '1px solid #d8dee8' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
