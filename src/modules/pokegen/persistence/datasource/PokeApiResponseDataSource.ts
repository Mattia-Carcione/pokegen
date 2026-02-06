import { EndpointApi } from "@/commons/enums/EndpointApi";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IDataSource } from "@/core/contracts/application/IDataSource";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

import { PokeApiResponseDto } from "@/modules/pokegen/application/dtos/PokeApiResponseDto";

/**
 * Data source per ottenere la lista delle risorse di Pokémon dalla PokéAPI.
 */
export class PokeApiResponseDataSource implements IDataSource<PokeApiResponseDto> {
    constructor(
        protected readonly httpClient: IHttpClient,
        protected readonly httpErrorMapper: IMapper<unknown, never>,
        protected readonly logger: ILogger,
    ) {}

    /**
     * Recupera i dati dell'entry point Pokémon dalla PokéAPI.
     * @returns Una promessa che risolve i dati tipizzati come PokeApiResponseDto
     * 
     * @throws DataSourceError se il recupero dei dati fallisce
     */
    async fetchData(endpoint: string = EndpointApi.EntryPoint, options?: { signal?: AbortSignal }): Promise<PokeApiResponseDto> {
        this.logger.debug("[PokeApiResponseDataSource] - Inizio del recupero dei dati della lista delle risorse delle generazioni di Pokémon.");
        try {
            const response = await this.httpClient.get<PokeApiResponseDto>(endpoint, options);
            return response;
        } catch (error) {
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);
            throw new ExternalServiceUnavailableError("Error fetching resource list data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}
