import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";


import generation1 from "../../../../../../assets/mock_data/generation-1.json";
import { GenerationDto } from "@/modules/pokegen/application/dtos/GenerationDto";

const generationById: Record<number, GenerationDto> = {
  1: generation1 as GenerationDto,
};

/**
 * Data source mock per ottenere i dati delle generazioni Pokemon.
 */
export class GenerationMockDataSource implements IDataSource<GenerationDto> {
  constructor(
    _httpClient: IHttpClient,
    _httpErrorMapper: IMapper<unknown, never>,
    private readonly logger: ILogger
  ) {}

  async fetchData(endpoint?: string): Promise<GenerationDto> {
    this.logger.debug(
      "[GenerationMockDataSource] - Recupero mock generazione con endpoint: " + (endpoint ?? "<none>")
    );

    const id = this.extractGenerationId(endpoint);
    const mock = (id ? generationById[id] : generationById[1]) ?? null;

    if (!mock) {
      throw new ExternalServiceUnavailableError(
        "Mock generation data not found for endpoint: " + (endpoint ?? "<none>")
      );
    }

    return mock;
  }

  private extractGenerationId(endpoint?: string): number | null {
    if (!endpoint) return null;

    const trimmed = endpoint.trim();
    if (!trimmed) return null;

    const match = trimmed.match(/generation\/(\d+)/i) || trimmed.match(/\b(\d+)\b/);
    if (!match) return null;

    const id = Number.parseInt(match[1], 10);
    return Number.isFinite(id) ? id : null;
  }
}
