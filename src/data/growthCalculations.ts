import type { ComparisonRow } from './types';

export const safeDiv = (numerator: number, denominator: number): number =>
  denominator === 0 ? 0 : numerator / denominator;

export const calculateGrowth = (currentValue: number, comparisonValue: number) => ({
  absoluteGrowth: currentValue - comparisonValue,
  percentGrowth: safeDiv(currentValue - comparisonValue, comparisonValue),
});

export const buildComparisonRow = (
  label: ComparisonRow['label'],
  currentValue: number,
  comparisonValue: number,
): ComparisonRow => ({
  label,
  currentValue,
  comparisonValue,
  ...calculateGrowth(currentValue, comparisonValue),
});

export const getPriorYearQuarterKey = (quarterKey: number): number => quarterKey - 10;
