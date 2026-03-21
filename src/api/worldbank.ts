import type { WBResponse, WBIndicatorValue } from "./worldbank.types";
import type { Country } from "@/types/migration";

const WB_BASE = "https://api.worldbank.org/v2";
const DEFAULT_YEAR = "2020";
const PER_PAGE = 300;

async function fetchIndicator(
  indicator: string,
  year = DEFAULT_YEAR,
): Promise<WBIndicatorValue[]> {
  const url =
    `${WB_BASE}/country/all/indicator/${indicator}` +
    `?date=${year}&format=json&per_page=${PER_PAGE}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`World Bank API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as WBResponse;
  return data[1] ?? [];
}

function indexByCountry(
  values: WBIndicatorValue[],
): Map<string, number | null> {
  const map = new Map<string, number | null>();
  for (const v of values) {
    if (v.countryiso3code) {
      map.set(v.countryiso3code, v.value);
    }
  }
  return map;
}

const AGGREGATE_CODES = new Set([
  "AFE", "AFW", "ARB", "CSS", "CEB", "EAR", "EAS", "EAP", "TEA",
  "EMU", "ECS", "ECA", "TEC", "EUU", "FCS", "HPC", "HIC", "IBD",
  "IBT", "IDB", "IDX", "IDA", "LTE", "LCN", "LAC", "TLA", "LDC",
  "LMY", "LIC", "LMC", "MEA", "MNA", "TMN", "MIC", "NAC", "INX",
  "OED", "OSS", "PSS", "PST", "PRE", "SST", "SAS", "TSA", "SSF",
  "SSA", "TSS", "UMC", "WLD",
]);

export async function fetchCountriesFromWB(
  year = DEFAULT_YEAR,
): Promise<Country[]> {
  const [netMigration, population, migrantStock] = await Promise.all([
    fetchIndicator("SM.POP.NETM", year),
    fetchIndicator("SP.POP.TOTL", year),
    fetchIndicator("SM.POP.TOTL", year),
  ]);

  const netMap = indexByCountry(netMigration);
  const popMap = indexByCountry(population);
  const stockMap = indexByCountry(migrantStock);

  const countryCodes = new Set<string>();
  const nameMap = new Map<string, string>();

  for (const v of [...netMigration, ...population, ...migrantStock]) {
    if (v.countryiso3code && !AGGREGATE_CODES.has(v.countryiso3code)) {
      countryCodes.add(v.countryiso3code);
      if (!nameMap.has(v.countryiso3code)) {
        nameMap.set(v.countryiso3code, v.country.value);
      }
    }
  }

  const countries: Country[] = [];

  for (const code of countryCodes) {
    const net = netMap.get(code) ?? null;
    const pop = popMap.get(code) ?? null;
    const stock = stockMap.get(code) ?? null;

    countries.push({
      code,
      name: nameMap.get(code) ?? code,
      population: pop,
      totalImmigrants: stock,
      totalEmigrants: stock != null && net != null ? stock - net : null,
      netMigration: net,
    });
  }

  return countries.sort((a, b) => a.name.localeCompare(b.name));
}
