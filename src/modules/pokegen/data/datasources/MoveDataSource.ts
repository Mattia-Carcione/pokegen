import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { checkEndpoint } from "@/core/utils/network/CheckEndpoint";
import { MoveDto } from "@/modules/pokegen/data/models/dtos/MoveDto";

/**
 * Data source per ottenere i dettagli delle mosse.
 */
export class MoveDataSource implements IDataSource<MoveDto> {
  protected readonly BASE_URI = EndpointApi.Move;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IHttpErrorMapper,
    private readonly logger: ILogger
  ) {}

  async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<MoveDto> {
    this.logger.debug("[MoveDataSource] - Inizio del recupero dei dati della mossa con endpoint: " + endpoint);

    try {
      endpoint = checkEndpoint(endpoint, this.BASE_URI, "[MoveDataSource]", this.logger);
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
