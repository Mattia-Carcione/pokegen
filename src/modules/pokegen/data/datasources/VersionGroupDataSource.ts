import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { checkEndpoint } from "@/core/utils/network/CheckEndpoint";
import { VersionGroupDto } from "@/modules/pokegen/data/models/dtos/VersionGroupDto";

/**
 * Data source per ottenere i dati dei Version Group.
 */
export class VersionGroupDataSource implements IDataSource<VersionGroupDto> {
  protected readonly BASE_URI = EndpointApi.VersionGroup;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IHttpErrorMapper,
    private readonly logger: ILogger
  ) {}

  /**
   * Recupera i dati del version-group da un endpoint specifico.
   * @param endpoint - L'endpoint da cui recuperare i dati del version-group
   * @returns Una promessa che risolve i dati del version-group tipizzati come VersionGroupDto
   */
  async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<VersionGroupDto> {
    this.logger.debug("[VersionGroupDataSource] - Inizio del recupero dei dati del version-group con endpoint: " + endpoint);

    try {
      endpoint = checkEndpoint(endpoint, this.BASE_URI, "[VersionGroupDataSource]", this.logger);
      const response = await this.httpClient.get<VersionGroupDto>(endpoint, options);
      return response;
    } catch (error) {
      if (error instanceof HttpError) this.httpErrorMapper.map(error);
      throw new ExternalServiceUnavailableError(
        "Error fetching version-group data. \n Details: External service unavailable." + (error as Error).message
      );
    }
  }
}
