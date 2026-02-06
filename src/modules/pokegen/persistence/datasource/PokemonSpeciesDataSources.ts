import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IMapper } from "@/core/contracts/application/IMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { PokemonSpeciesDto } from "@/modules/pokegen/application/dtos/PokemonSpeciesDto";

/**
 * Data source per ottenere i dati dei Pokémon.
 */
export class PokemonSpeciesDataSource implements IDataSource<PokemonSpeciesDto> {
    protected readonly BASE_URI = EndpointApi.PokemonSpecies;
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IMapper<unknown, never>,
        private readonly logger: ILogger
    ) {}
    
    /**
     * Recupera i dati del Pokémon da un endpoint specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come PokemonSpeciesDto
     * 
     * @throws DataSourceError se il recupero dei dati fallisce
     */
    async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<PokemonSpeciesDto> {
        this.logger.debug("[PokemonSpeciesDataSource] - Inizio del recupero dei dati della specie del Pokémon con endpoint: " + endpoint);

        try {
            endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);
            
            const response = await this.httpClient.get<PokemonSpeciesDto>(endpoint, options);
            return response;
        } catch (error) {
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching Pokémon Species data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}