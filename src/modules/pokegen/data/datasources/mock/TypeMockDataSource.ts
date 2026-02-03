import TypeDetailMockData from "@/../assets/mock_data/types-detail.json";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";

/**
 * Mock Data source per ottenere i dettagli dei tipi Pokémon da file JSON locali.
 * Utile per testing e sviluppo senza dipendere dall'API esterna.
 */
export class TypeMockDataSource implements IDataSource<TypeDto> {
  private mockData: TypeDto[];

  constructor() {
    this.mockData = TypeDetailMockData as TypeDto[];
  }

  /**
   * Recupera i dettagli del tipo Pokémon da mock locale.
   * @param endpoint - Nome del tipo o URL completo
   */
  async fetchData(endpoint: string): Promise<TypeDto> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const normalized = this.normalizeEndpoint(endpoint);
      const byName = this.mockData.find((t) => t.name.toLowerCase() === normalized);
      if (byName) return byName;

      const byId = this.mockData.find((t) => String(t.id) === normalized);
      if (byId) return byId;

      throw new Error(`Tipo non trovato nel mock: ${endpoint}`);
    } catch (error) {
      throw new ExternalServiceUnavailableError(
        "Errore nel recupero dei dettagli del tipo dal mock." + " \n Dettagli: " + (error as Error).message
      );
    }
  }

  private normalizeEndpoint(endpoint: string): string {
    const value = endpoint.trim().toLowerCase();
    if (value.includes(EndpointApi.Type)) {
      const parts = value.split(EndpointApi.Type);
      const last = parts[parts.length - 1];
      return last.replace(/\/+$/, "");
    }

    if (value.includes("/type/")) {
      const parts = value.split("/type/");
      const last = parts[parts.length - 1];
      return last.replace(/\/+$/, "");
    }

    return value.replace(/\/+$/, "");
  }
}
