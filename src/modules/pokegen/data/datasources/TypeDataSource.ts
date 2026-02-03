import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { checkEndpoint } from "@/core/utils/network/CheckEndpoint";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";

/**
 * Data source per ottenere i dati dei tipi Pokémon.
 */
export class TypeDataSource implements IDataSource<TypeDto> {
  protected readonly BASE_URI = EndpointApi.Type;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IHttpErrorMapper,
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
      endpoint = checkEndpoint(endpoint, this.BASE_URI, "[TypeDataSource]", this.logger);
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
