import type { MigrationFlowResponse } from "@/types/migration";
import { formatNumber, formatCompactNumber } from "@/lib/utils";
import "./StatsPanel.scss";

interface StatsPanelProps {
  flowsData: MigrationFlowResponse | undefined;
  onClose: () => void;
}

export function StatsPanel({ flowsData, onClose }: StatsPanelProps) {
  if (!flowsData) return null;

  const { country, flows, year } = flowsData;

  const inflows = flows
    .filter((f) => f.direction === "inflow")
    .sort((a, b) => b.value - a.value);

  const outflows = flows
    .filter((f) => f.direction === "outflow")
    .sort((a, b) => b.value - a.value);

  const totalIn = inflows.reduce((sum, f) => sum + f.value, 0);
  const totalOut = outflows.reduce((sum, f) => sum + f.value, 0);

  return (
    <aside className="stats">
      <div className="stats__header">
        <div>
          <h2 className="stats__country">{country.name}</h2>
          <span className="stats__year">{year} estimates</span>
        </div>
        <button className="stats__close" onClick={onClose} aria-label="Close">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="stats__overview">
        <div className="stats__metric">
          <span className="stats__metric-label">Population</span>
          <span className="stats__metric-value">
            {formatNumber(country.population)}
          </span>
        </div>
        <div className="stats__metric">
          <span className="stats__metric-label">Immigrants</span>
          <span className="stats__metric-value stats__metric-value--inflow">
            {formatNumber(country.totalImmigrants)}
          </span>
        </div>
        <div className="stats__metric">
          <span className="stats__metric-label">Emigrants</span>
          <span className="stats__metric-value stats__metric-value--outflow">
            {formatNumber(country.totalEmigrants)}
          </span>
        </div>
        <div className="stats__metric">
          <span className="stats__metric-label">Net Migration</span>
          <span
            className={`stats__metric-value ${
              (country.netMigration ?? 0) >= 0
                ? "stats__metric-value--inflow"
                : "stats__metric-value--outflow"
            }`}
          >
            {(country.netMigration ?? 0) >= 0 ? "+" : ""}
            {formatNumber(country.netMigration)}
          </span>
        </div>
      </div>

      <div className="stats__section">
        <h3 className="stats__section-title stats__section-title--inflow">
          <span className="stats__dot stats__dot--inflow" />
          Top Origins
          <span className="stats__section-total">
            {formatCompactNumber(totalIn)}
          </span>
        </h3>
        <ul className="stats__flow-list">
          {inflows.slice(0, 5).map((f) => (
            <li key={f.countryCode} className="stats__flow-item">
              <span className="stats__flow-name">{f.countryName}</span>
              <div className="stats__flow-bar-track">
                <div
                  className="stats__flow-bar stats__flow-bar--inflow"
                  style={{
                    width: `${Math.max(4, (f.value / (inflows[0]?.value || 1)) * 100)}%`,
                  }}
                />
              </div>
              <span className="stats__flow-value">
                {formatCompactNumber(f.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="stats__section">
        <h3 className="stats__section-title stats__section-title--outflow">
          <span className="stats__dot stats__dot--outflow" />
          Top Destinations
          <span className="stats__section-total">
            {formatCompactNumber(totalOut)}
          </span>
        </h3>
        <ul className="stats__flow-list">
          {outflows.slice(0, 5).map((f) => (
            <li key={f.countryCode} className="stats__flow-item">
              <span className="stats__flow-name">{f.countryName}</span>
              <div className="stats__flow-bar-track">
                <div
                  className="stats__flow-bar stats__flow-bar--outflow"
                  style={{
                    width: `${Math.max(4, (f.value / (outflows[0]?.value || 1)) * 100)}%`,
                  }}
                />
              </div>
              <span className="stats__flow-value">
                {formatCompactNumber(f.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
