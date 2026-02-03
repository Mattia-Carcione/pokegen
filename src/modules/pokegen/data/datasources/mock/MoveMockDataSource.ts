import MoveMockData from "@/../assets/mock_data/moves-detail.json";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { MoveDto } from "@/modules/pokegen/data/models/dtos/MoveDto";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";

/**
 * Mock Data source per ottenere i dettagli delle mosse da file JSON locali.
 */
export class MoveMockDataSource implements IDataSource<MoveDto> {
  private mockData: MoveDto[];

  constructor() {
    this.mockData = MoveMockData as MoveDto[];
  }

  async fetchData(endpoint: string): Promise<MoveDto> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));

      const normalized = this.normalizeEndpoint(endpoint);
      const byName = this.mockData.find((m) => m.name.toLowerCase() === normalized);
      if (byName) return byName;

      const byId = this.mockData.find((m) => String(m.id) === normalized);
      if (byId) return byId;

      return {
        id: 0,
        name: normalized,
        accuracy: null,
        power: null,
        pp: null,
        type: { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
        damage_class: { name: "status", url: "https://pokeapi.co/api/v2/move-damage-class/1/" },
        machines: []
      } as MoveDto;
    } catch (error) {
      throw new ExternalServiceUnavailableError(
        "Errore nel recupero dei dettagli della mossa dal mock." + " \n Dettagli: " + (error as Error).message
      );
    }
  }

  private normalizeEndpoint(endpoint: string): string {
    const value = endpoint.trim().toLowerCase();
    if (value.includes(EndpointApi.Move)) {
      const parts = value.split(EndpointApi.Move);
      const last = parts[parts.length - 1];
      return last.replace(/\/+$/, "");
    }

    if (value.includes("/move/")) {
      const parts = value.split("/move/");
      const last = parts[parts.length - 1];
      return last.replace(/\/+$/, "");
    }

    return value.replace(/\/+$/, "");
  }
}
