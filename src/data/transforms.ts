import type {
  BreakdownRow,
  ComparisonRow,
  DimensionKey,
  DrillDownData,
  KpiDefinition,
  KpiId,
  KpiSummary,
  RawRow,
} from './types';
import { getSortedQuarters, groupRowsByQuarter } from './aggregations';
import { buildComparisonRow, calculateGrowth, getPriorYearQuarterKey } from './growthCalculations';
import { computeKpiValue, KPI_CONFIG, KPI_DEFINITIONS, isKpiId } from './kpiConfig';

export { computeKpiValue } from './kpiConfig';
export { KPI_DEFINITIONS, isKpiId } from './kpiConfig';

const buildTrend = (
  kpiId: KpiId,
  quarters: Array<{ key: number; name: string }>,
  rowsByQuarter: Map<number, RawRow[]>,
) =>
  quarters.map((quarter) => ({
    quarter: quarter.name,
    value: computeKpiValue(kpiId, rowsByQuarter.get(quarter.key) ?? []),
  }));

const buildComparison = (
  kpiId: KpiId,
  currentRows: RawRow[],
  priorQuarterRows: RawRow[],
  priorYearRows: RawRow[],
): ComparisonRow[] => {
  const currentValue = computeKpiValue(kpiId, currentRows);
  const priorQuarterValue = computeKpiValue(kpiId, priorQuarterRows);
  const priorYearValue = computeKpiValue(kpiId, priorYearRows);

  return [
    buildComparisonRow('QoQ', currentValue, priorQuarterValue),
    buildComparisonRow('YoY', currentValue, priorYearValue),
  ];
};

const buildBreakdown = (
  kpiId: KpiId,
  currentRows: RawRow[],
  priorQuarterRows: RawRow[],
  priorYearRows: RawRow[],
  dimension: DimensionKey,
): BreakdownRow[] => {
  const dimensionValues = new Set(currentRows.map((row) => row[dimension]));

  return Array.from(dimensionValues)
    .map((name) => {
      const currentValue = computeKpiValue(
        kpiId,
        currentRows.filter((row) => row[dimension] === name),
      );
      const priorValue = computeKpiValue(
        kpiId,
        priorQuarterRows.filter((row) => row[dimension] === name),
      );
      const priorYearValue = computeKpiValue(
        kpiId,
        priorYearRows.filter((row) => row[dimension] === name),
      );
      const qoqGrowth = calculateGrowth(currentValue, priorValue);
      const yoyGrowth = calculateGrowth(currentValue, priorYearValue);

      return {
        name,
        value: currentValue,
        absoluteGrowth: qoqGrowth.absoluteGrowth,
        percentGrowth: qoqGrowth.percentGrowth,
        yoyAbsoluteGrowth: yoyGrowth.absoluteGrowth,
        yoyPercentGrowth: yoyGrowth.percentGrowth,
      };
    })
    .sort((a, b) => b.value - a.value);
};

export const buildKpiSummaries = (rows: RawRow[]): KpiSummary[] => {
  const quarters = getSortedQuarters(rows);
  const rowsByQuarter = groupRowsByQuarter(rows);
  const currentQuarter = quarters.at(-1);
  const priorQuarter = quarters.at(-2);

  if (!currentQuarter || !priorQuarter) return [];

  const currentRows = rowsByQuarter.get(currentQuarter.key) ?? [];
  const priorQuarterRows = rowsByQuarter.get(priorQuarter.key) ?? [];
  const priorYearRows = rowsByQuarter.get(getPriorYearQuarterKey(currentQuarter.key)) ?? [];

  return KPI_DEFINITIONS.map((definition) => {
    const calculate = KPI_CONFIG[definition.id].calculate;
    const currentValue = calculate(currentRows);
    const priorQtrValue = calculate(priorQuarterRows);
    const priorYearValue = calculate(priorYearRows);
    const qoqGrowth = calculateGrowth(currentValue, priorQtrValue);
    const yoyGrowth = calculateGrowth(currentValue, priorYearValue);

    return {
      ...definition,
      currentValue,
      priorQtrValue,
      priorYearValue,
      qoqDelta: qoqGrowth.absoluteGrowth,
      qoqDeltaPct: qoqGrowth.percentGrowth,
      yoyDelta: yoyGrowth.absoluteGrowth,
      yoyDeltaPct: yoyGrowth.percentGrowth,
      trend: buildTrend(definition.id, quarters, rowsByQuarter),
    };
  });
};

export const buildDrillDownData = (
  kpiId: KpiId,
  rows: RawRow[],
  dimension: DimensionKey,
): DrillDownData | null => {
  const definition: KpiDefinition | undefined = KPI_CONFIG[kpiId];
  const quarters = getSortedQuarters(rows);
  const rowsByQuarter = groupRowsByQuarter(rows);
  const currentQuarter = quarters.at(-1);
  const priorQuarter = quarters.at(-2);

  if (!definition || !currentQuarter || !priorQuarter) return null;

  const currentRows = rowsByQuarter.get(currentQuarter.key) ?? [];
  const priorQuarterRows = rowsByQuarter.get(priorQuarter.key) ?? [];
  const priorYearRows = rowsByQuarter.get(getPriorYearQuarterKey(currentQuarter.key)) ?? [];

  return {
    definition,
    currentQuarterName: currentQuarter.name,
    timeSeries: buildTrend(kpiId, quarters, rowsByQuarter),
    comparison: buildComparison(kpiId, currentRows, priorQuarterRows, priorYearRows),
    breakdown: buildBreakdown(kpiId, currentRows, priorQuarterRows, priorYearRows, dimension),
  };
};
