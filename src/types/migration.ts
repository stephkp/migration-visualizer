export interface Country {
  code: string;
  name: string;
  population?: number | null;
  totalImmigrants?: number | null;
  totalEmigrants?: number | null;
  netMigration?: number | null;
}

export type MigrationFlowDirection = "inflow" | "outflow";

export interface MigrationFlow {
  countryCode: string;
  countryName: string;
  value: number;
  direction: MigrationFlowDirection;
}

export interface MigrationFlowResponse {
  country: Country;
  flows: MigrationFlow[];
  year: string;
}

export interface NetMigrationEntry {
  countryCode: string;
  countryName: string;
  year: string;
  value?: number | null;
}

export interface GetMigrationFlowsParams {
  countryCode: string;
  year?: string;
}

export interface GetNetMigrationParams {
  year?: string;
}
