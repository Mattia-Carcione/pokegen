import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IMapper } from "@/core/contracts/application/IMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { TypeDto } from "@/modules/pokegen/application/dtos/TypeDto";

/**
 * Data source per ottenere i dati dei tipi Pokémon.
 */
export class TypeDataSource implements IDataSource<TypeDto> {
  protected readonly BASE_URI = EndpointApi.Type;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IMapper<unknown, never>,
    private readonly logger: ILogger
  ) {}

  /**
   * Recupera i dati del tipo da un endpoint specifico.
   * @param endpoint - L'endpoint da cui recuperare i dati del tipo
   * @returns Una promessa che risolve i dati del tipo tipizzati come TypeDto
   *
   * @throws ExternalServiceUnavailableError se il recupero dei dati fallisce
   */
  async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<TypeDto> {
    this.logger.debug("[TypeDataSource] - Inizio del recupero dei dati del tipo con endpoint: " + endpoint);

    try {
      endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);
      const response = await this.httpClient.get<TypeDto>(endpoint, options);
      return response;
    } catch (error) {
      if (error instanceof HttpError) this.httpErrorMapper.map(error);
      throw new ExternalServiceUnavailableError(
        "Error fetching type data. \n Details: External service unavailable." + (error as Error).message
      );
    }
  }
}
