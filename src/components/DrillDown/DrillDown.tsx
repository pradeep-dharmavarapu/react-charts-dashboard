import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPct, formatSignedValue, formatValue } from '../../data/formatters';
import type { DimensionKey, DrillDownData } from '../../data/types';
import { BreakdownBarChart } from '../charts/BreakdownBarChart';
import { TrendLineChart } from '../charts/TrendLineChart';
import { DeltaBadge } from '../ui/DeltaBadge';
import { DimensionToggle } from '../ui/DimensionToggle';

interface DrillDownProps {
  data: DrillDownData;
  dimension: DimensionKey;
  onDimensionChange: (dimension: DimensionKey) => void;
}

const dimensionLabels: Record<DimensionKey, string> = {
  THEATER: 'theater',
  PRODUCT: 'product',
  SEGMENT: 'segment',
};

export function DrillDown({ data, dimension, onDimensionChange }: DrillDownProps) {
  const currentValue = data.comparison[0]?.currentValue ?? 0;
  const qoq = data.comparison.find((row) => row.label === 'QoQ');
  const yoy = data.comparison.find((row) => row.label === 'YoY');

  return (
    <main className="app-shell detail-shell">
      <section className="detail-header" aria-labelledby="detail-title">
        <Link className="back-link" to="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Link>

        <div className="detail-title-row">
          <div>
            <p className="eyebrow">{data.currentQuarterName}</p>
            <h1 id="detail-title">{data.definition.label}</h1>
            <p>{data.definition.description}</p>
          </div>
          <strong>{formatValue(currentValue, data.definition.symbol)}</strong>
        </div>

        <div className="metric-strip" aria-label="Comparison summary">
          {qoq && (
            <div>
              <span>QoQ actual growth</span>
              <strong>{formatSignedValue(qoq.absoluteGrowth, data.definition.symbol)}</strong>
              <DeltaBadge delta={qoq.percentGrowth} higherIsBetter={data.definition.higherIsBetter} />
            </div>
          )}
          {yoy && (
            <div>
              <span>YoY actual growth</span>
              <strong>{formatSignedValue(yoy.absoluteGrowth, data.definition.symbol)}</strong>
              <DeltaBadge delta={yoy.percentGrowth} higherIsBetter={data.definition.higherIsBetter} label="YoY" />
            </div>
          )}
        </div>
      </section>

      <section className="detail-grid">
        <div className="panel panel-wide">
          <div className="panel-heading">
            <div>
              <h2>Quarterly Trend</h2>
              <p>Five-quarter actuals from the dataset.</p>
            </div>
          </div>
          <TrendLineChart data={data.timeSeries} symbol={data.definition.symbol} />
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Growth Table</h2>
              <p>Current quarter versus prior quarter and prior year.</p>
            </div>
          </div>
          <div className="table-wrap compact-table">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Actual</th>
                  <th>Growth</th>
                  <th>Growth %</th>
                </tr>
              </thead>
              <tbody>
                {data.comparison.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{formatValue(row.currentValue, data.definition.symbol)}</td>
                    <td>{formatSignedValue(row.absoluteGrowth, data.definition.symbol)}</td>
                    <td>{formatPct(row.percentGrowth)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel panel-wide panel-full">
          <div className="panel-heading split">
            <div>
              <h2>Breakdown by {dimensionLabels[dimension]}</h2>
              <p>Current quarter contribution with QoQ growth.</p>
            </div>
            <DimensionToggle value={dimension} onChange={onDimensionChange} />
          </div>
          <BreakdownBarChart data={data.breakdown} symbol={data.definition.symbol} />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{dimensionLabels[dimension]}</th>
                  <th>Actual</th>
                  <th>QoQ growth</th>
                  <th>QoQ growth %</th>
                  <th>YoY growth</th>
                  <th>YoY growth %</th>
                </tr>
              </thead>
              <tbody>
                {data.breakdown.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{formatValue(row.value, data.definition.symbol)}</td>
                    <td>{formatSignedValue(row.absoluteGrowth, data.definition.symbol)}</td>
                    <td>{formatPct(row.percentGrowth)}</td>
                    <td>{formatSignedValue(row.yoyAbsoluteGrowth, data.definition.symbol)}</td>
                    <td>{formatPct(row.yoyPercentGrowth)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
