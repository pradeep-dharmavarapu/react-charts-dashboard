import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatValue } from '../../data/formatters';
import type { BreakdownRow, SymbolKind } from '../../data/types';

interface BreakdownBarChartProps {
  data: BreakdownRow[];
  symbol: SymbolKind;
}

export function BreakdownBarChart({ data, symbol }: BreakdownBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 20, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatValue(Number(value), symbol)} width={72} />
        <Tooltip
          formatter={(value) => [formatValue(Number(value), symbol), 'Actual']}
          contentStyle={{ borderRadius: 8, border: '1px solid #d8dee8' }}
        />
        <Bar dataKey="value" fill="#0f766e" radius={[5, 5, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
