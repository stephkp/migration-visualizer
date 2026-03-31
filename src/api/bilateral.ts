import type { MigrationFlow, MigrationFlowResponse, Country } from "@/types/migration";

interface BilateralEntry {
  code: string;
  name: string;
  value: number;
}

interface BilateralCountryData {
  inflows: BilateralEntry[];
  outflows: BilateralEntry[];
}

interface BilateralDataFile {
  year: string;
  source: string;
  data: Record<string, BilateralCountryData>;
}

let cachedData: BilateralDataFile | null = null;

async function loadBilateralData(): Promise<BilateralDataFile> {
  if (cachedData) return cachedData;

  const res = await fetch("/data/bilateral-2020.json");
  if (!res.ok) {
    throw new Error(`Failed to load bilateral data: ${res.status}`);
  }

  cachedData = (await res.json()) as BilateralDataFile;
  return cachedData;
}

export async function getBilateralFlows(
  countryCode: string,
  country?: Country,
): Promise<MigrationFlowResponse | null> {
  const bilateral = await loadBilateralData();
  const entry = bilateral.data[countryCode];

  if (!entry) return null;

  const flows: MigrationFlow[] = [
    ...entry.inflows.map((f) => ({
      countryCode: f.code,
      countryName: f.name,
      value: f.value,
      direction: "inflow" as const,
    })),
    ...entry.outflows.map((f) => ({
      countryCode: f.code,
      countryName: f.name,
      value: f.value,
      direction: "outflow" as const,
    })),
  ];

  return {
    country: country ?? {
      code: countryCode,
      name: countryCode,
    },
    flows,
    year: bilateral.year,
  };
}
