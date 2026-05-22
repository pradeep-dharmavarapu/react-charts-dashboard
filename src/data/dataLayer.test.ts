import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSortedQuarters } from './aggregations';
import { safeDiv } from './growthCalculations';
import { computeKpiValue } from './kpiConfig';
import { parseCsvRows } from './parser';
import type { RawRow } from './types';

const dataset = parseCsvRows(
  readFileSync(resolve(process.cwd(), 'public/kpi_dataset.csv'), 'utf8'),
);

const currentRows = dataset.filter((row) => row.FISCAL_QUARTER_KEY === 20264);

const baseRow: RawRow = {
  KPI: 'Bookings',
  KPI_VALUE: 100,
  FISCAL_QUARTER_NAME: '4QFY26',
  FISCAL_QUARTER_KEY: 20264,
  FISCAL_MONTH_NAME: 'Feb FY26',
  FISCAL_MONTH_KEY: 202602,
  FISCAL_YEAR_NAME: 'FY26',
  THEATER: 'Americas',
  PRODUCT: 'FA',
  SEGMENT: 'Enterprise',
  OPPORTUNITY_ID: 'OPP1',
  ACCOUNT_ID: 'ACC1',
  ACCOUNT_NAME: 'Acme Industries',
  RECORD_TYPE: 'ES1 Opportunity',
  NEW_LOGO_FLAG: 'N',
  DEAL_VELOCITY: 25,
  SYMBOL: '$',
};

describe('KPI calculations', () => {
  it('reconciles all seven current-quarter KPIs against the provided dataset', () => {
    expect(computeKpiValue('bookings', currentRows)).toBeCloseTo(47_357_213.6, 2);
    expect(computeKpiValue('open-pipeline', currentRows)).toBeCloseTo(85_520_106.43, 2);
    expect(computeKpiValue('iqc-pipeline', currentRows)).toBeCloseTo(36_899_231.47, 2);
    expect(computeKpiValue('renewal-bookings', currentRows)).toBeCloseTo(21_149_395.7, 2);
    expect(computeKpiValue('average-deal-size', currentRows)).toBeCloseTo(520_408.940659, 4);
    expect(computeKpiValue('new-logos', currentRows)).toBe(10);
    expect(computeKpiValue('win-rate', currentRows)).toBeCloseTo(0.4408257039, 8);
  });

  it('counts distinct opportunities and accounts for derived KPIs', () => {
    const rows: RawRow[] = [
      { ...baseRow, KPI_VALUE: 100, OPPORTUNITY_ID: 'OPP1', ACCOUNT_ID: 'ACC1', NEW_LOGO_FLAG: 'Y' },
      { ...baseRow, KPI_VALUE: 200, OPPORTUNITY_ID: 'OPP1', ACCOUNT_ID: 'ACC1', NEW_LOGO_FLAG: 'Y' },
      { ...baseRow, KPI_VALUE: 300, OPPORTUNITY_ID: 'OPP2', ACCOUNT_ID: 'ACC2', NEW_LOGO_FLAG: 'Y' },
      { ...baseRow, KPI: 'Atbats', KPI_VALUE: 1_200, OPPORTUNITY_ID: 'OPP3', ACCOUNT_ID: 'ACC3' },
    ];

    expect(computeKpiValue('average-deal-size', rows)).toBe(300);
    expect(computeKpiValue('new-logos', rows)).toBe(2);
    expect(computeKpiValue('win-rate', rows)).toBe(0.5);
  });
});

describe('growth and quarter helpers', () => {
  it('guards zero denominators', () => {
    expect(safeDiv(100, 0)).toBe(0);
    expect(Number.isFinite(safeDiv(100, 0))).toBe(true);
  });

  it('sorts fiscal quarters by numeric key, not display name', () => {
    const rows: RawRow[] = [
      { ...baseRow, FISCAL_QUARTER_NAME: '4QFY26', FISCAL_QUARTER_KEY: 20264 },
      { ...baseRow, FISCAL_QUARTER_NAME: '1QFY26', FISCAL_QUARTER_KEY: 20261 },
      { ...baseRow, FISCAL_QUARTER_NAME: '4QFY25', FISCAL_QUARTER_KEY: 20254 },
    ];

    expect(getSortedQuarters(rows).map((quarter) => quarter.name)).toEqual([
      '4QFY25',
      '1QFY26',
      '4QFY26',
    ]);
  });
});

describe('CSV parser validation', () => {
  it('rejects invalid numeric values before they become NaN', () => {
    const csv = [
      'KPI,KPI_VALUE,FISCAL_QUARTER_NAME,FISCAL_QUARTER_KEY,FISCAL_MONTH_NAME,FISCAL_MONTH_KEY,FISCAL_YEAR_NAME,THEATER,PRODUCT,SEGMENT,OPPORTUNITY_ID,ACCOUNT_ID,ACCOUNT_NAME,RECORD_TYPE,NEW_LOGO_FLAG,DEAL_VELOCITY,SYMBOL',
      'Bookings,not-a-number,4QFY26,20264,Feb FY26,202602,FY26,Americas,FA,Enterprise,OPP1,ACC1,Acme,ES1 Opportunity,Y,12,$',
    ].join('\n');

    expect(() => parseCsvRows(csv)).toThrow(/Invalid KPI_VALUE/);
  });

  it('rejects unexpected dimensions and flags', () => {
    const csv = [
      'KPI,KPI_VALUE,FISCAL_QUARTER_NAME,FISCAL_QUARTER_KEY,FISCAL_MONTH_NAME,FISCAL_MONTH_KEY,FISCAL_YEAR_NAME,THEATER,PRODUCT,SEGMENT,OPPORTUNITY_ID,ACCOUNT_ID,ACCOUNT_NAME,RECORD_TYPE,NEW_LOGO_FLAG,DEAL_VELOCITY,SYMBOL',
      'Bookings,100,4QFY26,20264,Feb FY26,202602,FY26,Unknown,FA,Enterprise,OPP1,ACC1,Acme,ES1 Opportunity,Y,12,$',
    ].join('\n');

    expect(() => parseCsvRows(csv)).toThrow(/Unexpected THEATER/);
  });
});
