import { LightweightResponse } from "./LightweightResponse";

export interface ICacheDb {
  /**
   * Recupera una risposta memorizzata in cache.
   * @param key - La chiave della cache da recuperare.
   * @returns La risposta memorizzata o null se non esiste o è scaduta.
   */
  getCachedResponse<T>(key: string): Promise<LightweightResponse<T> | null>;

  /**
   * Memorizza una risposta in cache.
   * @param key - La chiave della cache da memorizzare.
   * @param response - La risposta da memorizzare.
   */  
    setCachedResponse<T>(key: string, response: LightweightResponse<T>): Promise<void>;

    /**
     * Recupera i metadati memorizzati in cache.
     * @param key - La chiave dei metadati da recuperare.
     * @returns I metadati memorizzati o null se non esistono.
     */
    getMetaData<T>(key: string): Promise<T | null>;

    /**
     * Memorizza i metadati in cache.
     * @param key - La chiave dei metadati da memorizzare.
     * @param data - I metadati da memorizzare.
     */
    setMetaData<T>(key: string, data: T): Promise<void>;

    /**
     * Cancella tutti i dati memorizzati in cache.
     */
    clearStore(): Promise<void>;
}