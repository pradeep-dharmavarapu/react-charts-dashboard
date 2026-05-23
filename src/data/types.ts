export type SourceKpi =
  | 'Bookings'
  | 'Open Pipeline'
  | 'IQC Pipeline'
  | 'Atbats'
  | 'Renewal Bookings';

export type KpiId =
  | 'bookings'
  | 'open-pipeline'
  | 'iqc-pipeline'
  | 'renewal-bookings'
  | 'average-deal-size'
  | 'new-logos'
  | 'win-rate';

export type SymbolKind = '$' | '#' | '%';
export type DimensionKey = 'THEATER' | 'PRODUCT' | 'SEGMENT';

export interface QuarterMeta {
  key: number;
  name: string;
}

export interface RawRow {
  KPI: SourceKpi;
  KPI_VALUE: number;
  FISCAL_QUARTER_NAME: string;
  FISCAL_QUARTER_KEY: number;
  FISCAL_MONTH_NAME: string;
  FISCAL_MONTH_KEY: number;
  FISCAL_YEAR_NAME: string;
  THEATER: 'Americas' | 'EMEA' | 'APJ';
  PRODUCT: 'FA' | 'FB' | 'Others';
  SEGMENT: 'Enterprise' | 'Commercial' | 'Corporate';
  OPPORTUNITY_ID: string;
  ACCOUNT_ID: string;
  ACCOUNT_NAME: string;
  RECORD_TYPE: string;
  NEW_LOGO_FLAG: 'Y' | 'N';
  DEAL_VELOCITY: number | null;
  SYMBOL: SymbolKind;
}

export interface KpiDefinition {
  id: KpiId;
  label: string;
  description: string;
  symbol: SymbolKind;
  higherIsBetter: boolean;
}

export interface KpiSummary extends KpiDefinition {
  currentValue: number;
  priorQtrValue: number;
  priorYearValue: number;
  qoqDelta: number;
  qoqDeltaPct: number;
  yoyDelta: number;
  yoyDeltaPct: number;
  trend: Array<{ quarter: string; value: number }>;
}

export interface ComparisonRow {
  label: 'QoQ' | 'YoY';
  currentValue: number;
  comparisonValue: number;
  absoluteGrowth: number;
  percentGrowth: number;
}

export interface BreakdownRow {
  name: string;
  value: number;
  absoluteGrowth: number;
  percentGrowth: number;
  yoyAbsoluteGrowth: number;
  yoyPercentGrowth: number;
}

export interface DrillDownData {
  definition: KpiDefinition;
  currentQuarterName: string;
  timeSeries: Array<{ quarter: string; value: number }>;
  comparison: ComparisonRow[];
  breakdown: BreakdownRow[];
}

export interface NormalizedKpiDataset {
  rawRows: RawRow[];
  quarters: QuarterMeta[];
  rowsByQuarter: Map<number, RawRow[]>;
  currentQuarter: QuarterMeta | null;
  priorQuarter: QuarterMeta | null;
  priorYearQuarterKey: number | null;
  currentRows: RawRow[];
  priorQuarterRows: RawRow[];
  priorYearRows: RawRow[];
}
