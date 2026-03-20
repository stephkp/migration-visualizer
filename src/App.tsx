import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { MigrationCanvas } from "@/components/MigrationCanvas";
import { MOCK_COUNTRIES, MOCK_FLOWS } from "@/data";

function App() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...MOCK_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)),
    [MOCK_COUNTRIES],
  );

  return (
    <div className="app">
      <Header></Header>
      <MigrationCanvas
        leftNodes={sorted}
        rightNodes={sorted}
        selectedCountryCode={selectedCountryCode}
        onSelectCountry={setSelectedCountryCode}
        hoveredCountryCode={hoveredCountryCode}
        onHoverCountry={setHoveredCountryCode}
        flowsData={selectedCountryCode ? MOCK_FLOWS[selectedCountryCode] : undefined}
      />
    </div>
  );
}

export default App;
