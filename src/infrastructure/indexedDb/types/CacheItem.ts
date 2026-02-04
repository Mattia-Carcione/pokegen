import { LightweightResponse } from "@/core/contracts/infrastructure/database/LightweightResponse";

/**
 * Interfaccia per l'elemento completo memorizzato in IndexedDB.
 */
export interface CachedItem<T = any> {
    key: string; // La chiave di cache, usata come keyPath
    response: LightweightResponse<T>;
    expiry: number; // Timestamp di scadenza (Date.now() + CACHE_LIFETIME_MS)
    cachedAt: number;
}

/**
 * Mappa della cache, dove la chiave è una stringa e il valore è un CachedItem.
 */
export interface CacheMap<T> {
  [key: string]: CachedItem<T>;
}