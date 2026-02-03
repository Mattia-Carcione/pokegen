import MachineMockData from "@/../assets/mock_data/machines-detail.json";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { MachineDto } from "@/modules/pokegen/data/models/dtos/MachineDto";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";

/**
 * Mock Data source per ottenere i dettagli delle macchine da file JSON locali.
 */
export class MachineMockDataSource implements IDataSource<MachineDto> {
  private mockData: MachineDto[];

  constructor() {
    this.mockData = MachineMockData as MachineDto[];
  }

  async fetchData(endpoint: string): Promise<MachineDto> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));

      const normalized = this.normalizeEndpoint(endpoint);
      const byId = this.mockData.find((m) => String(m.id) === normalized);
      if (byId) return byId;

      const byUrl = this.mockData.find((m) => m.item?.name?.toLowerCase() === normalized);
      if (byUrl) return byUrl;

      return {
        id: Number(normalized) || 0,
        item: { name: "tm00", url: "https://pokeapi.co/api/v2/item/1/" },
        move: { name: "unknown", url: "https://pokeapi.co/api/v2/move/0/" },
        version_group: { name: "red-blue", url: "https://pokeapi.co/api/v2/version-group/1/" }
      } as MachineDto;
    } catch (error) {
      throw new ExternalServiceUnavailableError(
        "Errore nel recupero dei dettagli della macchina dal mock." + " \n Dettagli: " + (error as Error).message
      );
    }
  }

  private normalizeEndpoint(endpoint: string): string {
    const value = endpoint.trim().toLowerCase();
    if (value.includes(EndpointApi.Machine)) {
      const parts = value.split(EndpointApi.Machine);
      const last = parts[parts.length - 1];
      return last.replace(/\/+$/, "");
    }

    if (value.includes("/machine/")) {
      const parts = value.split("/machine/");
      const last = parts[parts.length - 1];
      return last.replace(/\/+$/, "");
    }

    return value.replace(/\/+$/, "");
  }
}
