import { distinctCount, filterByKpi, sumKpi } from '../../data/aggregations';
import { safeDiv } from '../../data/growthCalculations';
import type { RawRow } from '../../data/types';

export type KpiCalculator = (rows: RawRow[]) => number;

export const calculateBookings: KpiCalculator = (rows) => sumKpi(rows, 'Bookings');

export const calculateOpenPipeline: KpiCalculator = (rows) => sumKpi(rows, 'Open Pipeline');

export const calculateIqcPipeline: KpiCalculator = (rows) => sumKpi(rows, 'IQC Pipeline');

export const calculateRenewalBookings: KpiCalculator = (rows) => sumKpi(rows, 'Renewal Bookings');

export const calculateAverageDealSize: KpiCalculator = (rows) => {
  const bookings = filterByKpi(rows, 'Bookings');
  return safeDiv(sumKpi(rows, 'Bookings'), distinctCount(bookings, 'OPPORTUNITY_ID'));
};

export const calculateNewLogos: KpiCalculator = (rows) =>
  distinctCount(
    rows.filter((row) => row.KPI === 'Bookings' && row.NEW_LOGO_FLAG === 'Y'),
    'ACCOUNT_ID',
  );

export const calculateWinRateByValue: KpiCalculator = (rows) =>
  safeDiv(sumKpi(rows, 'Bookings'), sumKpi(rows, 'Atbats'));
