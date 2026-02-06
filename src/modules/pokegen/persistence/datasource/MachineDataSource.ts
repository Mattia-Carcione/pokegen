import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { MachineDto } from "@/modules/pokegen/application/dtos/MachineDto";

/**
 * Data source per ottenere i dettagli delle macchine.
 */
export class MachineDataSource implements IDataSource<MachineDto> {
  protected readonly BASE_URI = EndpointApi.Machine;

  constructor(
    private readonly httpClient: IHttpClient,
    private readonly httpErrorMapper: IMapper<unknown, never>,
    private readonly logger: ILogger
  ) {}

  async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<MachineDto> {
    this.logger.debug("[MachineDataSource] - Inizio del recupero dei dati della macchina con endpoint: " + endpoint);

    try {
      endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);
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
