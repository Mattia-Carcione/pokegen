import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { MoveDto } from "@/modules/pokegen/application/dtos/MoveDto";

/**
 * Data source per ottenere i dettagli delle mosse.
 */
export class MoveDataSource implements IDataSource<MoveDto> {
  protected readonly BASE_URI = EndpointApi.Move;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IMapper<unknown, never>,
    private readonly logger: ILogger
  ) {}

  async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<MoveDto> {
    this.logger.debug("[MoveDataSource] - Inizio del recupero dei dati della mossa con endpoint: " + endpoint);

    try {
      endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);
      const response = await this.httpClient.get<MoveDto>(endpoint, options);
      return response;
    } catch (error) {
      if (error instanceof HttpError) this.httpErrorMapper.map(error);
      throw new ExternalServiceUnavailableError(
        "Error fetching move data. \n Details: External service unavailable." + (error as Error).message
      );
    }
  }
}
