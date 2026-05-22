import type { KpiCalculator } from './kpiCalculations';
import {
  calculateAverageDealSize,
  calculateBookings,
  calculateIqcPipeline,
  calculateNewLogos,
  calculateOpenPipeline,
  calculateRenewalBookings,
  calculateWinRateByValue,
} from './kpiCalculations';
import type { KpiDefinition, KpiId } from './types';

export interface KpiConfig extends KpiDefinition {
  calculate: KpiCalculator;
}

export const KPI_CONFIG: Record<KpiId, KpiConfig> = {
  bookings: {
    id: 'bookings',
    label: 'Bookings',
    description: 'Closed-won opportunity value in the period.',
    symbol: '$',
    higherIsBetter: true,
    calculate: calculateBookings,
  },
  'open-pipeline': {
    id: 'open-pipeline',
    label: 'Open Pipeline',
    description: 'Open opportunities scheduled to close in the period.',
    symbol: '$',
    higherIsBetter: true,
    calculate: calculateOpenPipeline,
  },
  'iqc-pipeline': {
    id: 'iqc-pipeline',
    label: 'IQC Pipeline',
    description: 'Opportunities created in the current quarter.',
    symbol: '$',
    higherIsBetter: true,
    calculate: calculateIqcPipeline,
  },
  'renewal-bookings': {
    id: 'renewal-bookings',
    label: 'Renewal Bookings',
    description: 'Renewal opportunities closed-won in the period.',
    symbol: '$',
    higherIsBetter: true,
    calculate: calculateRenewalBookings,
  },
  'average-deal-size': {
    id: 'average-deal-size',
    label: 'Average Deal Size',
    description: 'Bookings divided by distinct won opportunities.',
    symbol: '$',
    higherIsBetter: true,
    calculate: calculateAverageDealSize,
  },
  'new-logos': {
    id: 'new-logos',
    label: 'New Logos',
    description: 'Distinct first-time customer accounts won.',
    symbol: '#',
    higherIsBetter: true,
    calculate: calculateNewLogos,
  },
  'win-rate': {
    id: 'win-rate',
    label: 'Win Rate by Value',
    description: 'Bookings as a share of all stage-eight opportunities.',
    symbol: '%',
    higherIsBetter: true,
    calculate: calculateWinRateByValue,
  },
};

export const KPI_DEFINITIONS: KpiDefinition[] = Object.values(KPI_CONFIG).map(
  ({ calculate: _calculate, ...definition }) => definition,
);

export const isKpiId = (value: string | undefined): value is KpiId =>
  Boolean(value && value in KPI_CONFIG);

export const computeKpiValue = (kpiId: KpiId, rows: Parameters<KpiCalculator>[0]): number =>
  KPI_CONFIG[kpiId].calculate(rows);
