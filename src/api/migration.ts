import { fetchCountriesFromWB } from "./worldbank";
import { getBilateralFlows } from "./bilateral";
import type {
  Country,
  MigrationFlowResponse,
  GetMigrationFlowsParams,
} from "@/types/migration";
import { MOCK_COUNTRIES, MOCK_FLOWS } from "@/data";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export async function getCountries(): Promise<Country[]> {
  if (USE_MOCK) return MOCK_COUNTRIES;
  return fetchCountriesFromWB();
}

export async function getMigrationFlows(
  params: GetMigrationFlowsParams,
): Promise<MigrationFlowResponse | null> {
  if (USE_MOCK) {
    return MOCK_FLOWS[params.countryCode] ?? null;
  }
  const result = await getBilateralFlows(params.countryCode);
  if (result) return result;
  // Fallback for countries missing from bilateral dataset
  return MOCK_FLOWS[params.countryCode] ?? null;
}
