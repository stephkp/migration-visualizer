import { useState, useMemo, useCallback } from "react";
import type { Country, MigrationFlowResponse } from "@/types/migration";
import { useCountries, useMigrationFlows } from "@/api";

export function useMigrationData() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);

  const { data: allCountries = [], isLoading: countriesLoading } = useCountries();
  const { data: flowsRaw, isLoading: flowsLoading } = useMigrationFlows(selectedCountryCode);

  const flowsData: MigrationFlowResponse | undefined = flowsRaw ?? undefined;

  const countries = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = q
      ? allCountries.filter((c) => c.name.toLowerCase().includes(q))
      : allCountries;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, allCountries]);

  const selectedCountry: Country | undefined = useMemo(
    () =>
      selectedCountryCode
        ? countries.find((c) => c.code === selectedCountryCode)
        : undefined,
    [selectedCountryCode, countries],
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
    isLoading: countriesLoading || flowsLoading,
  };
}
