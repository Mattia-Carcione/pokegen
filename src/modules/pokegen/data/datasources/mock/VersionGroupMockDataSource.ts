import VersionGroupMockData from "@/../assets/mock_data/version-groups-detail.json";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { VersionGroupDto } from "@/modules/pokegen/data/models/dtos/VersionGroupDto";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";

/**
 * Mock Data source per ottenere i dettagli dei version-group da file JSON locali.
 * Utile per testing e sviluppo senza dipendere dall'API esterna.
 */
export class VersionGroupMockDataSource implements IDataSource<VersionGroupDto> {
  private mockData: VersionGroupDto[];

  constructor() {
    this.mockData = VersionGroupMockData as VersionGroupDto[];
  }

  /**
   * Recupera i dettagli del version-group da mock locale.
   * @param endpoint - Nome del version-group o URL completo
   */
  async fetchData(endpoint: string): Promise<VersionGroupDto> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const normalized = this.normalizeEndpoint(endpoint);
      const byName = this.mockData.find((g) => g.name.toLowerCase() === normalized);
      if (byName) return byName;

      const byId = this.mockData.find((g) => String(g.id) === normalized);
      if (byId) return byId;

      throw new Error(`Version-group non trovato nel mock: ${endpoint}`);
    } catch (error) {
      throw new ExternalServiceUnavailableError(
        "Errore nel recupero dei dettagli del version-group dal mock." + " \n Dettagli: " + (error as Error).message
      );
    }
  }

  private normalizeEndpoint(endpoint: string): string {
    const value = endpoint.trim().toLowerCase();
    if (value.includes(EndpointApi.VersionGroup)) {
      const parts = value.split(EndpointApi.VersionGroup);
      const last = parts[parts.length - 1];
      return last.replace(/\/+$/, "");
    }

    if (value.includes("/version-group/")) {
      const parts = value.split("/version-group/");
      const last = parts[parts.length - 1];
      return last.replace(/\/+$/, "");
    }

    return value.replace(/\/+$/, "");
  }
}
