import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IMapper } from "@/core/contracts/application/IMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { PokemonDto } from "@/modules/pokegen/application/dtos/PokemonDto";

/**
 * Data source per ottenere i dati dei Pokémon.
 */
export class PokemonDataSource implements IDataSource<PokemonDto> {
    protected readonly BASE_URI = EndpointApi.Pokemon;
    protected readonly GENERATION_URI = EndpointApi.Generation;
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IMapper<unknown, never>,
        private readonly logger: ILogger
    ) {}
    
    /**
     * Recupera i dati del Pokémon da un endpoint specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come PokemonDto
     * 
     * @throws ExternalServiceUnavailableError se il recupero dei dati fallisce
     */
    async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<PokemonDto> {
        this.logger.debug("[PokemonDataSource] - Inizio del recupero dei dati del Pokémon con endpoint: " + endpoint);
        
        try {
            endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);
            
            endpoint = endpoint.replace(EndpointApi.PokemonSpecies, EndpointApi.Pokemon);
            const response = await this.httpClient.get<PokemonDto>(endpoint, options);
            return response;
        } catch (error) {
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching Pokémon data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}