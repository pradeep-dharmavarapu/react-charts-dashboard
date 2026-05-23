# NorthStar Executive KPI Dashboard

This is a React + TypeScript dashboard for the NorthStar Analytics take-home brief. It loads the provided CSV in the browser, calculates the seven KPIs, and lets the user click into any KPI to see the trend and breakdown behind it.

I focused on keeping the app simple, readable, and correct. The data calculations live outside the UI, and the UI is built around the two main views from the brief: the KPI grid and the drill-down page.

## Running the App

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

To run checks:

```bash
npm test
npm run build
```

## What Is Included

- A dashboard grid with all 7 KPIs.
- Current-quarter value for each KPI.
- QoQ and YoY comparison context.
- Small trend chart on each KPI card.
- Drill-down page for each KPI.
- Five-quarter trend view.
- Breakdown by Theater, Product, or Segment.
- Table with actuals, QoQ growth, QoQ growth %, YoY growth, and YoY growth %.
- Loading, error, and empty states.
- Basic keyboard and accessibility support.

## KPI Logic

The app uses the latest `FISCAL_QUARTER_KEY` in the CSV as the current quarter. For this dataset, that is `4QFY26`.

Implemented KPIs:

- Bookings: sum of `KPI_VALUE` where `KPI = Bookings`
- Open Pipeline: sum of `KPI_VALUE` where `KPI = Open Pipeline`
- IQC Pipeline: sum of `KPI_VALUE` where `KPI = IQC Pipeline`
- Renewal Bookings: sum of `KPI_VALUE` where `KPI = Renewal Bookings`
- Average Deal Size: Bookings divided by distinct won opportunities
- New Logos: distinct accounts where `NEW_LOGO_FLAG = Y`
- Win Rate by Value: Bookings divided by Atbats

Growth calculations are shared so QoQ and YoY are handled consistently. If the comparison value is zero, the app returns `0` instead of showing `NaN` or `Infinity`.

## Project Structure

The main pieces are:

- `src/data`: CSV parsing, normalization, formatting, growth calculations, and view-model transforms.
- `src/features/kpi`: KPI definitions and formulas.
- `src/features/dashboard`: home dashboard and KPI cards.
- `src/features/drill-down`: drill-down page, trend, growth table, and breakdown section.
- `src/features/dimensions`: Theater/Product/Segment toggle.
- `src/shared`: shared charts, UI components, and hooks.
- `src/store`: loads the CSV once and stores the normalized data.

## Library Choices

- Vite, React, and TypeScript for the app setup.
- PapaParse for CSV parsing.
- Recharts for the sparklines and trend chart.
- Custom CSS bars for the horizontal breakdown chart so the labels and table alignment are easier to control.
- Zustand for a small app-level data store.
- CSS modules for component-level styling.


## Deployment


- Build command: `npm run build`
- Output directory: `dist`
