import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { IMapper } from "@/core/contracts/application/IMapper";
import { EndpointApi } from "@/commons/enums/EndpointApi";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";
import { PokedexDto } from "@/modules/pokegen/application/dtos/PokedexDto";

/**
 * Data source per ottenere i dati dei Pokédex.
 */
export class PokedexDataSource implements IDataSource<PokedexDto> {
  protected readonly BASE_URI = EndpointApi.Pokedex;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IMapper<unknown, never>,
    private readonly logger: ILogger
  ) {}

  async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<PokedexDto> {
    this.logger.debug("[PokedexDataSource] - Inizio del recupero dei dati del Pokédex con endpoint: " + endpoint);

    try {
      endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);
      const response = await this.httpClient.get<PokedexDto>(endpoint, options);
      return response;
    } catch (error) {
      if (error instanceof HttpError) this.httpErrorMapper.map(error);
      throw new ExternalServiceUnavailableError(
        "Error fetching Pokédex data. \n Details: External service unavailable." + (error as Error).message
      );
    }
  }
}
