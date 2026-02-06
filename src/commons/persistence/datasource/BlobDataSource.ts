import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { HttpError } from "@/infrastructure/http/errors/HttpError";

/**
 * Data source per il recupero di dati Blob (ad esempio immagini) da un endpoint esterno.
 */
export class BlobDataSource implements IDataSource<Blob> {
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IMapper<unknown, never>,
        private readonly logger: ILogger
    ) {}

    /**
     * Recupera i dati Blob da un endpoint specificato.
     * @param endpoint - L'endpoint da cui recuperare i dati Blob
     * @returns I dati Blob recuperati dall'endpoint
     * @throws ExternalServiceUnavailableError se il servizio esterno non è disponibile
     */
    async fetchData(endpoint: string, options?: { signal?: AbortSignal, responseType?: 'blob' }): Promise<Blob> {
        this.logger.debug("[BlobDataSource] - Inizio del recupero dei dati dell'immagine da: " + endpoint);

        try {
            const response = await this.httpClient.get<Blob>(endpoint, options);
            return response;
        } catch (error) {
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching image data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}