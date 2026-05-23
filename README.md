# NorthStar Executive KPI Dashboard

This is a single-page React + TypeScript dashboard for the NorthStar Analytics take-home brief. It loads the provided CSV in the browser, derives the seven executive KPIs from the raw rows, and lets a user click into any KPI to understand the trend and breakdown behind the number.

I kept the first version intentionally focused: correctness in the data layer first, then a clean executive-facing UI on top of it. The goal was to make the dashboard easy to scan, but also easy to reason about in code.

## Running the App

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Tests:

```bash
npm test
```

## What Is Included

- A responsive KPI grid with all seven current-quarter metrics.
- QoQ movement on each card, with compact value formatting and trend sparklines.
- A drill-down route for each KPI at `/kpi/:kpiId`.
- Five-quarter trend charts.
- Breakdown by theater, product, or segment.
- QoQ and YoY actual growth, absolute growth, and percent growth.
- Loading, error, and no-data states.
- Keyboard-friendly navigation back from the drill-down.

## Architecture

I separated the calculation work from the UI because this is the part of the assignment where small shortcuts can get expensive quickly. React components should not know how to calculate win rate or distinct new logos; they should receive already-shaped data and render it.

The data layer lives under `src/data` and has no React imports:

- `parser.ts` parses the CSV, normalizes values, and validates expected fields.
- `normalizeDataset.ts` builds the reusable quarter and row-group model once after load.
- `aggregations.ts` contains reusable grouping, summing, distinct count, and quarter sorting helpers.
- `growthCalculations.ts` handles safe division and growth math.
- `transforms.ts` builds the summary and drill-down view models consumed by the UI.
- `formatters.ts` keeps currency, percent, and count formatting consistent.

Product-facing code is grouped by feature:

- `src/features/kpi` owns KPI formulas and the KPI registry.
- `src/features/dashboard` owns the dashboard route view, grid, and KPI cards.
- `src/features/drill-down` owns the drill-down route view and its focused panels.
- `src/features/dimensions` owns dimension metadata and controls.
- `src/shared/ui` and `src/shared/charts` hold reusable presentation primitives.
- `src/store` loads the CSV once, stores the normalized dataset, and exposes precomputed KPI summaries.

Routes are lazy-loaded from `src/app/App.tsx` so feature code and chart-heavy dependencies do not all sit on the initial bootstrap path.

## KPI Logic

The current quarter is selected from the highest `FISCAL_QUARTER_KEY`, which resolves to `4QFY26` for the provided dataset. Quarters are always sorted by `FISCAL_QUARTER_KEY`, not by display name.

Implemented formulas:

- **Bookings**: `SUM(KPI_VALUE)` where `KPI = 'Bookings'`
- **Open Pipeline**: `SUM(KPI_VALUE)` where `KPI = 'Open Pipeline'`
- **IQC Pipeline**: `SUM(KPI_VALUE)` where `KPI = 'IQC Pipeline'`
- **Renewal Bookings**: `SUM(KPI_VALUE)` where `KPI = 'Renewal Bookings'`
- **Average Deal Size**: bookings value divided by distinct won opportunities
- **New Logos**: distinct account count where `KPI = 'Bookings'` and `NEW_LOGO_FLAG = 'Y'`
- **Win Rate by Value**: bookings value divided by at-bats value

Growth calculations use a shared `safeDiv` helper so zero denominators return `0` instead of producing `NaN` or `Infinity`.

## Library Choices

- **Vite + React + TypeScript**: quick setup, fast feedback loop, and strong typing without extra framework complexity.
- **PapaParse**: reliable CSV parsing with header handling instead of hand-rolled parsing.
- **Recharts**: enough charting power for sparklines, trend lines, and breakdown bars without adding a heavier visualization layer.
- **React Router**: gives each drill-down a shareable URL and normal browser back behavior.
- **Zustand**: small, typed state layer for this app's load state and derived KPI summaries.
- **Plain CSS**: for a take-home of this size, custom CSS kept the styling direct and easy to inspect.

## Validation and Tests

The tests focus on the areas most likely to break:

- all seven KPI calculations against the provided CSV
- distinct count behavior for average deal size and new logos
- win rate as a cross-KPI calculation
- zero-denominator growth handling
- fiscal quarter sorting by numeric key
- parser validation for invalid numeric and enum fields

I did not try to make the test suite exhaustive. I focused it around the data correctness risks called out in the brief.

## UX Notes

I aimed for an executive dashboard style: clear hierarchy, compact formatting, restrained color, and quick comparison. The home view is optimized for scanning, while the drill-down gives more context through trend, growth, and dimension contribution.

For the dimension breakdown, I included a toggle for theater, product, and segment rather than adding global filters. That keeps the first version focused while still giving enough room to explore the story behind each KPI.

## Tradeoffs and Next Steps

If I had more time, I would add:

- CSV export from drill-down tables.
- A persisted preference for the selected drill-down dimension.
- Month-level trend expansion using the fiscal month fields already present in the CSV.
- A small visual regression pass across more viewport sizes.

## Deployment

The app is ready to deploy on Vercel:

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites are configured in `vercel.json`
