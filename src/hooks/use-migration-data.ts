import { useState, useMemo, useCallback } from "react";
import type { Country, MigrationFlowResponse } from "@/types/migration";
import { MOCK_COUNTRIES, MOCK_FLOWS } from "@/data";

export function useMigrationData() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);

  const countries = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = q
      ? MOCK_COUNTRIES.filter((c) => c.name.toLowerCase().includes(q))
      : MOCK_COUNTRIES;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery]);

  const selectedCountry: Country | undefined = useMemo(
    () =>
      selectedCountryCode
        ? countries.find((c) => c.code === selectedCountryCode)
        : undefined,
    [selectedCountryCode, countries],
  );

  const flowsData: MigrationFlowResponse | undefined = useMemo(
    () => (selectedCountryCode ? MOCK_FLOWS[selectedCountryCode] : undefined),
    [selectedCountryCode],
  );

  const selectCountry = useCallback((code: string | null) => {
    setSelectedCountryCode(code);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCountryCode(null);
  }, []);

  return {
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
  };
}
