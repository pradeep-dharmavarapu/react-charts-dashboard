import type { DimensionKey } from '../../data/types';

export interface DimensionConfig {
  key: DimensionKey;
  label: string;
  sentenceLabel: string;
}

export const DIMENSIONS: DimensionConfig[] = [
  { key: 'THEATER', label: 'Theater', sentenceLabel: 'theater' },
  { key: 'PRODUCT', label: 'Product', sentenceLabel: 'product' },
  { key: 'SEGMENT', label: 'Segment', sentenceLabel: 'segment' },
];

export const DIMENSION_LABELS: Record<DimensionKey, string> = Object.fromEntries(
  DIMENSIONS.map((dimension) => [dimension.key, dimension.sentenceLabel]),
) as Record<DimensionKey, string>;
