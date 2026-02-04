// import { CachedResponse } from "@/core/types/CacheTypes";
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { CacheKeyFactory } from "@/infrastructure/indexedDb/CacheKeyFactory";
import { CachedAxiosResponse, CustomAxiosRequestConfig } from "../types/CacheAxiosConfig";
import { CachedResponse } from "@/infrastructure/indexedDb/types/CachedResponse";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ICacheDb } from "@/core/contracts/infrastructure/database/ICacheDb";

/**
 * Classi per l'intercettore di cache Axios.
 */
export class CacheInterceptor {
    constructor(
        private readonly cacheDb: ICacheDb,
        private readonly logger: ILogger
    ) {}

    /**
     * Imposta l'intercettore di risposta per memorizzare le risposte in cache.
     * @param client - Istanza di Axios su cui applicare l'intercettore.
     * @returns void
     */
    setCache(client: AxiosInstance) {
        client.interceptors.response.use(async (response: CachedAxiosResponse) => {
                const shouldCache = response.config.method?.toLowerCase() === 'get' &&
                    response.status >= 200 && response.status < 300 &&
                    !response.cached && response.config.cacheKey;

                if (shouldCache) {
                    // La funzione setCachedResponse è tipizzata per accettare AxiosResponse
                    await this.cacheDb.setCachedResponse<CachedResponse>(response.config.cacheKey!, response);
                }

                // Restituisce sempre la risposta originale (o cachata)
                this.logger.debug("[CacheInterceptor] - Risposta memorizzata in cache per la richiesta:", response.config.url);
                return response;

            }, (error: any) => {
                this.logger.debug("[CacheInterceptor] - Errore nell'Interceptor di risposta:", error);
                if (error.__fromCache && error.response) {
                        return Promise.resolve({
                        ...error.response,
                        __forceDataOnly: true,
                        cached: true,
                    });
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Imposta l'intercettore di richiesta per recuperare le risposte dalla cache.
     * @param client - Istanza di Axios su cui applicare l'intercettore.
     * @returns void
     */
    getCache(client: AxiosInstance) {
        client.interceptors.request.use(async (config: InternalAxiosRequestConfig & CustomAxiosRequestConfig) => {
                // Solo richieste GET
                if (config.method?.toLowerCase() !== 'get') return config;

                const cacheKey = CacheKeyFactory.generateCacheKey(config);
                config.cacheKey = cacheKey; // Conserva la chiave per l'Interceptor di risposta
                try {
                    // Tipizziamo la risposta attesa
                    const cachedResponse = await this.cacheDb.getCachedResponse<CachedResponse>(cacheKey);

                    if (cachedResponse) {
                        // Cache Hit: Restituisce un oggetto che simula la AxiosResponse
                        const fakeResponse: CachedAxiosResponse = {
                            data: cachedResponse.data,
                            status: cachedResponse.status,
                            statusText: cachedResponse.statusText,
                            headers: cachedResponse.headers,
                            config: config,
                            request: {}, // Oggetto request minimale o vuoto
                            cached: true,
                        };
                        // Restituendo un oggetto non-config, Axios interrompe la richiesta di rete
                        return Promise.reject({ __fromCache: true, response: fakeResponse });
                    }

                } catch (error) {
                    // In caso di errore IndexedDB, si logga e si procede con la richiesta HTTP
                    this.logger.debug("[CacheInterceptor] - Errore critico nell'Interceptor di richiesta (IndexedDB):", error);
                }

                // Cache Miss o Errore: Restituisce la configurazione per far procedere la richiesta HTTP
                this.logger.debug("[CacheInterceptor] - Cache miss per la richiesta:", config.url);
                return config;

            }, (error: AxiosError) => {
                this.logger.debug("[CacheInterceptor] - Errore nell'Interceptor di richiesta:", error);
                return Promise.reject(error);
            }
        );
    }
}