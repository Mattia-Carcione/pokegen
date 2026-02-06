import { IDataSource } from "@/core/contracts/application/IDataSource";
import { EndpointApi } from "@/commons/enums/EndpointApi";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IMapper } from "@/core/contracts/application/IMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { EvolutionChainDto } from "../../application/dtos/EvolutionChainDto";

/**
 * Data source per ottenere i dati delle generazioni Pokémon.
 */
export class EvolutionChainDataSource implements IDataSource<EvolutionChainDto> {
    protected readonly BASE_URI = EndpointApi.EvolutionChain;

    constructor(
        protected readonly httpClient: IHttpClient,
        protected readonly httpErrorMapper: IMapper<unknown, never>,
        protected readonly logger: ILogger,
    ) {}
    
    /**
     * Recupera i dati della catena evolutiva da PokeAPI.
     * @param endpoint - L'endpoint da cui recuperare i dati della catena evolutiva
     * @returns Una promessa che risolve i dati della catena evolutiva tipizzati come EvolutionChainDto
     * @throws ExternalServiceUnavailableError se il servizio esterno non è disponibile o si verifica un errore durante il recupero dei dati
     */
    async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<EvolutionChainDto> {
        this.logger.debug("[EvolutionChainDataSource] - Inizio del recupero dei dati della catena evolutiva con endpoint: " + endpoint);
        
        try {
            endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);

            const response = await this.httpClient.get<EvolutionChainDto>(endpoint, options);
            return response;
        } catch (error) {
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching evolution chain data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}