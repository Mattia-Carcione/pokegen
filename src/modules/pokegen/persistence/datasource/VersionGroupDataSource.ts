import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IMapper } from "@/core/contracts/application/IMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { VersionGroupDto } from "@/modules/pokegen/application/dtos/VersionGroupDto";

/**
 * Data source per ottenere i dati dei Version Group.
 */
export class VersionGroupDataSource implements IDataSource<VersionGroupDto> {
  protected readonly BASE_URI = EndpointApi.VersionGroup;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IMapper<unknown, never>,
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
      endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);
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
