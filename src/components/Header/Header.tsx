import type { Country } from "@/types/migration";
import "./Header.scss";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCountry?: Country;
}

export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div className="header__brand-text">
          <h1 className="header__title">FlowState</h1>
          <p className="header__tagline">Global Migration</p>
        </div>
      </div>

      <div className="header__search">
        <div className="header__search-wrapper">
          <svg className="header__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="header__search-input"
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header__legend">
        <div className="header__legend-item">
          <span className="header__legend-dot header__legend-dot--outflow" />
          <span className="header__legend-label">Outflow (Emigrants)</span>
        </div>
        <div className="header__legend-item">
          <span className="header__legend-dot header__legend-dot--inflow" />
          <span className="header__legend-label">Inflow (Immigrants)</span>
        </div>
      </div>
    </header>
  );
}
