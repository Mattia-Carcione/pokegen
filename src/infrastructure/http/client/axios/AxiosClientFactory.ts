import { RetryAxiosRequestConfig } from "./types/RetryAxiosRequestconfig";
import { AxiosHttpClient } from "./AxiosHttpClient";
import { DEFAULT_OPTS } from "../../config/HttpConfig";
import axios from "axios";
import { RetryInterceptor } from "./interceptors/RetryInterceptor";
import { CacheInterceptor } from "./interceptors/CacheInterceptor";
import { IHttpClientFactory } from "@/core/contracts/infrastructure/http/IHttpClientFactory";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ICacheDb } from "@/core/contracts/infrastructure/database/ICacheDb";


/**
 * Creazione dell'istanza di axios, con interceptor, retry e get/set in cache.
 */
export class AxiosClientFactory implements IHttpClientFactory {
    constructor(
        private readonly cacheDb: ICacheDb,
        private readonly logger: ILogger
    ) {}

    /**
     * Crea un'istanza di AxiosHttpClient con le configurazioni specificate.
     * @param baseUrl - L'URL di base per le richieste HTTP. 
     * @param opts - Opzioni di configurazione per il retry delle richieste.
     * @returns Un'istanza di AxiosHttpClient configurata.
     */
    create(baseUrl?: string, opts: RetryAxiosRequestConfig = DEFAULT_OPTS): AxiosHttpClient {
        /**
            * axios.create(config);
            * Crea l'istanza Axios.
            *
            * config:
            * è l'oggetto di configurazione, da passare alla funzione create, 
            * che definisce come l'istanza Axios deve comportarsi per tutte le richieste
            * fatte con questa istanza.
            * 
            * timeout: number
            * Tempo massimo (in ms) prima di far fallire la richiesta.
            * 
            * responseType: json (default) | text | arraybuffer | blob | stream
            * Tipo di rsposta desiderato.
            *
            * responseEncoding: 'utf8'
            * Encoding del testo.
            * 
            * transformResponse: [(data) => any]
            * Trasforma la risposta prima che venga passata a .then()
            * 
            */
        const apiClient = axios.create({
            baseURL: baseUrl,
            timeout: 5000, // default timeout di 5s
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            }, //default content type accettato
        });

        new RetryInterceptor(this.logger).setRetryAsync(apiClient, opts);

        new CacheInterceptor(this.cacheDb, this.logger).getCache(apiClient);
        
        new CacheInterceptor(this.cacheDb, this.logger).setCache(apiClient);
        
        return new AxiosHttpClient(apiClient, this.logger);
    }
}