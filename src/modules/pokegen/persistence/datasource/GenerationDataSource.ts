import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

import { GenerationDto } from "../../application/dtos/GenerationDto";

/**
 * Data source per ottenere i dati delle generazioni Pokémon.
 */
export class GenerationDataSource implements IDataSource<GenerationDto> {
    protected readonly BASE_URI = EndpointApi.Generation;

    constructor(
        protected readonly httpClient: IHttpClient,
        protected readonly httpErrorMapper: IMapper<unknown, never>,
        protected readonly logger: ILogger,
    ) {}
    
    /**
     * Recupera i dati della generazione da PokeAPI.
     * @param endpoint - L'endpoint da cui recuperare i dati della generazione
     * @returns Una promessa che risolve i dati della generazione tipizzati come GenerationDto
     * @throws ExternalServiceUnavailableError se il servizio esterno non è disponibile o si verifica un errore durante il recupero dei dati
     */
    async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<GenerationDto> {
        this.logger.debug("[GenerationDataSource] - Inizio del recupero dei dati della generazione con endpoint: " + endpoint);
        
        try {
            endpoint = NetworkHelper.replaceUrl(endpoint, this.BASE_URI);

            const response = await this.httpClient.get<GenerationDto>(endpoint, options);
            return response;
        } catch (error) {
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching generation data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}