import { Header } from "@/components/Header";
import { MigrationCanvas } from "@/components/MigrationCanvas";
import { StatsPanel } from "@/components/StatsPanel";
import { useMigrationData } from "@/hooks/use-migration-data";

export function Home() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCountryCode,
    selectCountry,
    clearSelection,
    hoveredCountryCode,
    setHoveredCountryCode,
    countries,
    selectedCountry,
    flowsData,
  } = useMigrationData();

  return (
    <div className="app">
      <Header
        selectedCountry={selectedCountry}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <MigrationCanvas
        leftNodes={countries}
        rightNodes={countries}
        selectedCountryCode={selectedCountryCode}
        onSelectCountry={selectCountry}
        hoveredCountryCode={hoveredCountryCode}
        onHoverCountry={setHoveredCountryCode}
        flowsData={flowsData}
      />
      <StatsPanel flowsData={flowsData} onClose={clearSelection} />
    </div>
  );
}
