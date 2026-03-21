import { useQuery } from "@tanstack/react-query";
import { getCountries, getMigrationFlows } from "./migration";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: 30 * 60 * 1000,
  });
}

export function useMigrationFlows(countryCode: string | null) {
  return useQuery({
    queryKey: ["flows", countryCode],
    queryFn: () => getMigrationFlows({ countryCode: countryCode! }),
    enabled: !!countryCode,
    staleTime: 5 * 60 * 1000,
  });
}
