import { getSortedQuarters, groupRowsByQuarter } from './aggregations';
import { getPriorYearQuarterKey } from './growthCalculations';
import type { NormalizedKpiDataset, RawRow } from './types';

export const normalizeDataset = (rawRows: RawRow[]): NormalizedKpiDataset => {
  const quarters = getSortedQuarters(rawRows);
  const rowsByQuarter = groupRowsByQuarter(rawRows);
  const currentQuarter = quarters.at(-1) ?? null;
  const priorQuarter = quarters.at(-2) ?? null;
  const priorYearQuarterKey = currentQuarter ? getPriorYearQuarterKey(currentQuarter.key) : null;

  return {
    rawRows,
    quarters,
    rowsByQuarter,
    currentQuarter,
    priorQuarter,
    priorYearQuarterKey,
    currentRows: currentQuarter ? rowsByQuarter.get(currentQuarter.key) ?? [] : [],
    priorQuarterRows: priorQuarter ? rowsByQuarter.get(priorQuarter.key) ?? [] : [],
    priorYearRows: priorYearQuarterKey ? rowsByQuarter.get(priorYearQuarterKey) ?? [] : [],
  };
};
