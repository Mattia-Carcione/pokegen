import { AxiosError, AxiosInstance } from "axios";
import { RetryAxiosRequestConfig } from "../types/RetryAxiosRequestconfig";
import { DEFAULT_OPTS } from "../../../config/HttpConfig";
import { AxiosRetry } from "../utils/AxiosRetry";
import { Jitter } from "@/infrastructure/http/utils/Jitter";
import { delay } from "@/commons/utils/async/Delay";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Classi di utilità per il ritardo asincrono.
 */
export class RetryInterceptor {
    constructor(private readonly logger: ILogger) {}
    
    /**
     * Applica il jitter alla strategia di retry.
     * @param client - Istanza di Axios su cui applicare l'intercettore.
     * @param opts - Configurazione del retry.
     * @returns Promise<void>
     */
    async setRetryAsync(client: AxiosInstance, opts: RetryAxiosRequestConfig = DEFAULT_OPTS): Promise<void> {
        let prevDelay: number | undefined;
        client.interceptors.response.use(
            (response) => response, // Se la risposta è positiva, la passiamo avanti
            async (error: AxiosError) => {
                // Castiamo l'oggetto config all'interfaccia estesa per TypeScript
                const config = { ...opts, ...error.config } as RetryAxiosRequestConfig;

                if(!error.config) return Promise.reject(error);
                
                // Verifichiamo che la configurazione del retry esista
                if (!config || config.retry === undefined) {
                    this.logger.error("[RetryInterceptor] - Configurazione di retry mancante. Rigetto immediato.");
                    // Se manca la configurazione, rigettiamo l'errore immediatamente
                    return Promise.reject(error);
                }
                // 1. Inizializzazione del Contatore
                config.__retryCount = config.__retryCount || 0;

                // 2. Controllo Condizione di Arresto
                if (config.__retryCount >= config.retry) {
                    this.logger.error(`[RetryInterceptor] - Tentativi esauriti (${config.retry}). Fallimento definitivo.`);
                    return Promise.reject(error);
                }

                // 3. Controllo Ritentabilità dell'Errore
                if (!AxiosRetry.isRetryableAxiosError(error)) {
                    this.logger.error("[RetryInterceptor] - Errore non ritentabile (es. 404/400). Rigetto.");
                    return Promise.reject(error);
                }

                // 4. Esecuzione del Retry
                // Incrementa il contatore
                config.__retryCount++;

                // ** IMPLEMENTAZIONE DEL FULL JITTER **
                // Genera un ritardo casuale tra 0 e il Backoff calcolato
                const jitterDelay = Jitter.applyJitter(config, prevDelay);
                prevDelay = jitterDelay;

                // Attendi il tempo calcolato
                await delay(jitterDelay);

                // Ripeti la richiesta utilizzando la configurazione originale aggiornata
                // L'intercettore ritorna una Promise risolta dalla nuova chiamata API
                this.logger.warn(`[RetryInterceptor] - Tentativo #${config.__retryCount} dopo errore. Ritardo di ${jitterDelay} ms.`);
                return client(config);
            }
        );
    }
}