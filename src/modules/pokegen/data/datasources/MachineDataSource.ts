import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { checkEndpoint } from "@/core/utils/network/CheckEndpoint";
import { MachineDto } from "@/modules/pokegen/data/models/dtos/MachineDto";

/**
 * Data source per ottenere i dettagli delle macchine.
 */
export class MachineDataSource implements IDataSource<MachineDto> {
  protected readonly BASE_URI = EndpointApi.Machine;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IHttpErrorMapper,
    private readonly logger: ILogger
  ) {}

  async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<MachineDto> {
    this.logger.debug("[MachineDataSource] - Inizio del recupero dei dati della macchina con endpoint: " + endpoint);

    try {
      endpoint = checkEndpoint(endpoint, this.BASE_URI, "[MachineDataSource]", this.logger);
      const response = await this.httpClient.get<MachineDto>(endpoint, options);
      return response;
    } catch (error) {
      if (error instanceof HttpError) this.httpErrorMapper.map(error);
      throw new ExternalServiceUnavailableError(
        "Error fetching machine data. \n Details: External service unavailable." + (error as Error).message
      );
    }
  }
}
