import Papa from 'papaparse';
import type { RawRow } from './types';

interface CsvRow {
  KPI: string;
  KPI_VALUE: string;
  FISCAL_QUARTER_NAME: string;
  FISCAL_QUARTER_KEY: string;
  FISCAL_MONTH_NAME: string;
  FISCAL_MONTH_KEY: string;
  FISCAL_YEAR_NAME: string;
  THEATER: string;
  PRODUCT: string;
  SEGMENT: string;
  OPPORTUNITY_ID: string;
  ACCOUNT_ID: string;
  ACCOUNT_NAME: string;
  RECORD_TYPE: string;
  NEW_LOGO_FLAG: string;
  DEAL_VELOCITY: string;
  SYMBOL: string;
}

const sourceKpis = ['Bookings', 'Open Pipeline', 'IQC Pipeline', 'Atbats', 'Renewal Bookings'] as const;
const symbols = ['$', '#', '%'] as const;
const theaters = ['Americas', 'EMEA', 'APJ'] as const;
const products = ['FA', 'FB', 'Others'] as const;
const segments = ['Enterprise', 'Commercial', 'Corporate'] as const;
const newLogoFlags = ['Y', 'N'] as const;

const isOneOf = <T extends readonly string[]>(value: string, options: T): value is T[number] =>
  options.includes(value);

const parseNumber = (value: string, column: keyof CsvRow, rowIndex: number): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${column} at row ${rowIndex}: ${value || 'blank'}`);
  }

  return parsed;
};

const requireText = (value: string, column: keyof CsvRow, rowIndex: number): string => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`Missing ${column} at row ${rowIndex}`);
  }

  return trimmed;
};

const normalizeRow = (row: CsvRow, index: number): RawRow => {
  const rowIndex = index + 2;
  const kpi = requireText(row.KPI, 'KPI', rowIndex);
  const symbol = requireText(row.SYMBOL, 'SYMBOL', rowIndex);
  const theater = requireText(row.THEATER, 'THEATER', rowIndex);
  const product = requireText(row.PRODUCT, 'PRODUCT', rowIndex);
  const segment = requireText(row.SEGMENT, 'SEGMENT', rowIndex);
  const newLogoFlag = requireText(row.NEW_LOGO_FLAG, 'NEW_LOGO_FLAG', rowIndex);

  if (!isOneOf(kpi, sourceKpis)) throw new Error(`Unexpected KPI at row ${rowIndex}: ${kpi}`);
  if (!isOneOf(symbol, symbols)) throw new Error(`Unexpected SYMBOL at row ${rowIndex}: ${symbol}`);
  if (!isOneOf(theater, theaters)) throw new Error(`Unexpected THEATER at row ${rowIndex}: ${theater}`);
  if (!isOneOf(product, products)) throw new Error(`Unexpected PRODUCT at row ${rowIndex}: ${product}`);
  if (!isOneOf(segment, segments)) throw new Error(`Unexpected SEGMENT at row ${rowIndex}: ${segment}`);
  if (!isOneOf(newLogoFlag, newLogoFlags)) {
    throw new Error(`Unexpected NEW_LOGO_FLAG at row ${rowIndex}: ${newLogoFlag}`);
  }

  const dealVelocity = row.DEAL_VELOCITY.trim()
    ? parseNumber(row.DEAL_VELOCITY, 'DEAL_VELOCITY', rowIndex)
    : null;

  return {
    KPI: kpi,
    KPI_VALUE: parseNumber(row.KPI_VALUE, 'KPI_VALUE', rowIndex),
    FISCAL_QUARTER_NAME: requireText(row.FISCAL_QUARTER_NAME, 'FISCAL_QUARTER_NAME', rowIndex),
    FISCAL_QUARTER_KEY: parseNumber(row.FISCAL_QUARTER_KEY, 'FISCAL_QUARTER_KEY', rowIndex),
    FISCAL_MONTH_NAME: requireText(row.FISCAL_MONTH_NAME, 'FISCAL_MONTH_NAME', rowIndex),
    FISCAL_MONTH_KEY: parseNumber(row.FISCAL_MONTH_KEY, 'FISCAL_MONTH_KEY', rowIndex),
    FISCAL_YEAR_NAME: requireText(row.FISCAL_YEAR_NAME, 'FISCAL_YEAR_NAME', rowIndex),
    THEATER: theater,
    PRODUCT: product,
    SEGMENT: segment,
    OPPORTUNITY_ID: requireText(row.OPPORTUNITY_ID, 'OPPORTUNITY_ID', rowIndex),
    ACCOUNT_ID: requireText(row.ACCOUNT_ID, 'ACCOUNT_ID', rowIndex),
    ACCOUNT_NAME: requireText(row.ACCOUNT_NAME, 'ACCOUNT_NAME', rowIndex),
    RECORD_TYPE: requireText(row.RECORD_TYPE, 'RECORD_TYPE', rowIndex),
    NEW_LOGO_FLAG: newLogoFlag,
    DEAL_VELOCITY: dealVelocity,
    SYMBOL: symbol,
  };
};

export const parseCsvRows = (csv: string): RawRow[] => {
  const parsed = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().replace(/^\uFEFF/, ''),
  });

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0]?.message ?? 'Unable to parse CSV');
  }

  return parsed.data.map(normalizeRow);
};
