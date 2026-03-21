import { fetchJson } from "./client";
import { fetchCountriesFromWB } from "./worldbank";
import type {
  Country,
  MigrationFlowResponse,
  GetMigrationFlowsParams,
} from "@/types/migration";
import { MOCK_COUNTRIES, MOCK_FLOWS } from "@/data";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export async function getCountries(): Promise<Country[]> {
  if (USE_MOCK) return MOCK_COUNTRIES;
  return fetchCountriesFromWB();
}

export async function getMigrationFlows(
  params: GetMigrationFlowsParams,
): Promise<MigrationFlowResponse | null> {
  // Bilateral flow data is not available from World Bank.
  // Always use mock flows; replace with a real bilateral API when available.
  if (USE_MOCK || !import.meta.env.VITE_FLOWS_API_URL) {
    return MOCK_FLOWS[params.countryCode] ?? null;
  }
  const qs = params.year ? `?year=${params.year}` : "";
  return fetchJson<MigrationFlowResponse>(
    `/flows/${params.countryCode}${qs}`,
  );
}
