import type {
  BreakdownRow,
  ComparisonRow,
  DimensionKey,
  DrillDownData,
  KpiDefinition,
  KpiId,
  KpiSummary,
  NormalizedKpiDataset,
  RawRow,
} from './types';
import { calculateGrowth, buildComparisonRow } from './growthCalculations';
import { normalizeDataset } from './normalizeDataset';
import { computeKpiValue, KPI_CONFIG, KPI_DEFINITIONS, isKpiId } from '../features/kpi/kpiConfig';

export { computeKpiValue } from '../features/kpi/kpiConfig';
export { KPI_DEFINITIONS, isKpiId } from '../features/kpi/kpiConfig';

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
  const currentGroups = groupRowsByDimension(currentRows, dimension);
  const priorQuarterGroups = groupRowsByDimension(priorQuarterRows, dimension);
  const priorYearGroups = groupRowsByDimension(priorYearRows, dimension);

  return Array.from(currentGroups.keys())
    .map((name) => {
      const currentValue = computeKpiValue(kpiId, currentGroups.get(name) ?? []);
      const priorValue = computeKpiValue(kpiId, priorQuarterGroups.get(name) ?? []);
      const priorYearValue = computeKpiValue(kpiId, priorYearGroups.get(name) ?? []);
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

const groupRowsByDimension = (
  rows: RawRow[],
  dimension: DimensionKey,
): Map<string, RawRow[]> => {
  const groups = new Map<string, RawRow[]>();

  rows.forEach((row) => {
    const dimensionRows = groups.get(row[dimension]) ?? [];
    dimensionRows.push(row);
    groups.set(row[dimension], dimensionRows);
  });

  return groups;
};

const asNormalizedDataset = (dataset: NormalizedKpiDataset | RawRow[]): NormalizedKpiDataset =>
  Array.isArray(dataset) ? normalizeDataset(dataset) : dataset;

export const buildKpiSummaries = (dataset: NormalizedKpiDataset | RawRow[]): KpiSummary[] => {
  const {
    quarters,
    rowsByQuarter,
    currentQuarter,
    priorQuarter,
    currentRows,
    priorQuarterRows,
    priorYearRows,
  } = asNormalizedDataset(dataset);

  if (!currentQuarter || !priorQuarter) return [];

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
  dataset: NormalizedKpiDataset | RawRow[],
  dimension: DimensionKey,
): DrillDownData | null => {
  const definition: KpiDefinition | undefined = KPI_CONFIG[kpiId];
  const {
    quarters,
    rowsByQuarter,
    currentQuarter,
    priorQuarter,
    currentRows,
    priorQuarterRows,
    priorYearRows,
  } = asNormalizedDataset(dataset);

  if (!definition || !currentQuarter || !priorQuarter) return null;

  return {
    definition,
    currentQuarterName: currentQuarter.name,
    timeSeries: buildTrend(kpiId, quarters, rowsByQuarter),
    comparison: buildComparison(kpiId, currentRows, priorQuarterRows, priorYearRows),
    breakdown: buildBreakdown(kpiId, currentRows, priorQuarterRows, priorYearRows, dimension),
  };
};
