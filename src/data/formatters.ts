import type { SymbolKind } from './types';

const compactNumber = (value: number): string => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value < 10 ? 1 : 0,
  }).format(value);
};

export const formatCurrency = (value: number): string => {
  const sign = value < 0 ? '-' : '';
  return `${sign}$${compactNumber(Math.abs(value))}`;
};

export const formatPct = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

export const formatCount = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);

export const formatValue = (value: number, symbol: SymbolKind): string => {
  if (symbol === '$') return formatCurrency(value);
  if (symbol === '%') return formatPct(value);
  return formatCount(value);
};

export const formatSignedValue = (value: number, symbol: SymbolKind): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatValue(value, symbol)}`;
};
