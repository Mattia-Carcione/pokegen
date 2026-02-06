import { AxiosResponse } from "axios";
import { LightweightResponse } from "../../core/contracts/infrastructure/database/LightweightResponse";
import { CachedItem } from "./types/CacheItem";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { DB_NAME, DB_VERSION, STORE_NAME, CACHE_LIFETIME_MS, META_DATA_STORE_NAME } from "./const";
import { ICacheDb } from "@/core/contracts/infrastructure/database/ICacheDb";

/**
 * Classe per la gestione della cache utilizzando IndexedDB.
 * Fornisce metodi per ottenere e memorizzare risposte HTTP in cache.
 */
export class CacheDb implements ICacheDb {
    // Variabile per memorizzare l'istanza del DB una volta aperta
    private dbPromise: Promise<IDBDatabase> | null = null;
    
    constructor(private readonly logger: ILogger) {}

    /**
     * Apre il database IndexedDB.
     * Se lo store non esiste (prima apertura o aggiornamento versione), lo crea.
     * @returns {Promise<IDBDatabase>} Una Promise che risolve con l'oggetto DB.
     */
    private openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            // [Non verificato] Controllo la disponibilità di IndexedDB nel browser.
            if (!('indexedDB' in window)) {
                this.logger.error("IndexedDB non supportato in questo ambiente.");
                reject(new Error("IndexedDB not supported"));
                return;
            }

            const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION);

            // Gestione dell'evento di aggiornamento dello schema (prima creazione)
            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                // Crea l'Object Store se non esiste
                if (!db.objectStoreNames.contains(STORE_NAME))
                    db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                if (!db.objectStoreNames.contains(META_DATA_STORE_NAME))
                    db.createObjectStore(META_DATA_STORE_NAME, { keyPath: 'key' });
            };

            // Gestione del successo nell'apertura
            request.onsuccess = () => resolve(request.result);

            // Gestione degli errori
            request.onerror = () => {
                this.logger.error("IndexedDB: Errore nell'apertura del DB:", request.error);
                reject(request.error);
            };

            request.onblocked = () => console.warn("IndexedDB blocked");
        });
    }


    /**
     * Funzione di utilità per ottenere l'istanza del DB (Singleton pattern).
     * @returns {Promise<IDBDatabase>} L'oggetto DB.
     */
    private async getDB(): Promise<IDBDatabase> {
        if (!this.dbPromise) {
            // La prima volta, apriamo il DB
            this.dbPromise = this.openDB();
        }
        return this.dbPromise;
    }

    // --- Operazioni principali di Caching ---
    /**
     * Recupera un elemento dalla cache, controllando la scadenza.
     * @param {string} key La chiave di cache.
     * @returns {Promise<LightweightResponse | null>} L'oggetto risposta Axios *leggero* o null.
     */
 async getCachedResponse<T>(key: string): Promise<LightweightResponse<T> | null> {
        try {
            const db = await this.getDB();
            const transaction: IDBTransaction = db.transaction([STORE_NAME], 'readonly');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);

            // L'operazione get è sincrona sulla transazione, ma in una Promise wrapper
            const request: IDBRequest<CachedItem<T>> = store.get(key);

            return new Promise((resolve, reject) => {
                request.onsuccess = (event: Event) => {
                    const cachedItem = (event.target as IDBRequest<CachedItem<T>>).result;

                    if (cachedItem) {
                        const now = Date.now();
                        if (now < cachedItem.expiry) resolve(cachedItem.response);
                        else resolve(null);
                    } else  resolve(null); 
                };

                request.onerror = (event: Event) => {
                    this.logger.error("Errore IndexedDB get:", (event.target as IDBRequest).error);
                    reject((event.target as IDBRequest).error);
                };
            });
        } catch (error) {
            this.logger.error("Errore IndexedDB (getDB):", error);
            return null; // Fallback sicuro
        }
    }

    /**
     * Memorizza una risposta in IndexedDB con un timestamp di scadenza.
     * @param {string} key La chiave di cache.
     * @param {AxiosResponse} response L'oggetto risposta completo di Axios.
     */
 async setCachedResponse<T>(key: string, response: AxiosResponse<T>): Promise<void> {
        try {
            const db = await this.getDB();
            // Transazione di tipo 'readwrite'
            const transaction: IDBTransaction = db.transaction([STORE_NAME], 'readwrite');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);

            const expiry: number = Date.now() + CACHE_LIFETIME_MS;

            // Crea un oggetto risposta leggero da memorizzare (vedi spiegazione sotto)
            const lightweightResponse: LightweightResponse<T> = {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                // Conserviamo solo l'essenziale della config per la tracciabilità
                config: { url: response.config.url, method: response.config.method },
            };

            const itemToStore: CachedItem<T> = {
                key: key, // Usato come keyPath per lo store
                response: lightweightResponse,
                expiry: expiry,
                cachedAt: Date.now()
            };

            // Il metodo put inserisce o aggiorna l'elemento in base alla 'key'
            const request: IDBRequest = store.put(itemToStore);

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve();

                request.onerror = (event: Event) => {
                    this.logger.error("Errore IndexedDB set:", (event.target as IDBRequest).error);
                    reject((event.target as IDBRequest).error);
                };
            });
        } catch (error) {
            this.logger.error("Errore IndexedDB (setDB):", error);
            // La scrittura in cache non deve bloccare il flusso principale
        }
    }

    /**
     * Recupera i metadati dalla cache.
     * @param {string} key La chiave di cache.
     * @returns {Promise<T | null>} I dati memorizzati o null se non trovati.
     */
    async getMetaData<T>(key: string): Promise<T | null> {
        try {
            const db = await this.getDB();
            const transaction: IDBTransaction = db.transaction([META_DATA_STORE_NAME], 'readonly');
            const store: IDBObjectStore = transaction.objectStore(META_DATA_STORE_NAME);

            // L'operazione get è sincrona sulla transazione, ma in una Promise wrapper
            const request: IDBRequest<T> = store.get(key);

            return new Promise((resolve, reject) => {
                request.onsuccess = (event: Event) => {
                    const data = (event.target as IDBRequest<T>).result;
                    resolve(data);
                };

                request.onerror = (event: Event) => {
                    this.logger.error("Errore IndexedDB getMetaData:", (event.target as IDBRequest).error);
                    reject((event.target as IDBRequest).error);
                };
            });
        } catch (error) {
            this.logger.error("Errore IndexedDB (getMetaData):", error);
            return null; // Fallback sicuro
        }
    }

    /**
     * Memorizza i metadati in IndexedDB.
     * @param {string} key La chiave di cache.
     * @param {T} data I dati da memorizzare.
     */
    async setMetaData<T>(key: string, data: T): Promise<void> {
        try {
            const db = await this.getDB();
            // Transazione di tipo 'readwrite'
            const transaction: IDBTransaction = db.transaction([META_DATA_STORE_NAME], 'readwrite');
            const store: IDBObjectStore = transaction.objectStore(META_DATA_STORE_NAME);

            // Il metodo put inserisce o aggiorna l'elemento in base alla 'key'
            const request: IDBRequest = store.put({ key, ...data });

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve();

                request.onerror = (event: Event) => {
                    this.logger.error("Errore IndexedDB setMetaData:", (event.target as IDBRequest).error);
                    reject((event.target as IDBRequest).error);
                };
            });
        } catch (error) {
            this.logger.error("Errore IndexedDB (setMetaData):", error);
            // La scrittura in cache non deve bloccare il flusso principale
        }
    }

    /**
     * Pulisce tutti gli elementi memorizzati nella cache.
     */
    async clearStore(): Promise<void> {
        try {
            const db = await this.getDB();
            const transaction: IDBTransaction = db.transaction([STORE_NAME, META_DATA_STORE_NAME], 'readwrite');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);
            const metaStore: IDBObjectStore = transaction.objectStore(META_DATA_STORE_NAME);
            store.clear();
            metaStore.clear();
        } catch (error) {
            this.logger.error("Errore IndexedDB (clearStore):", error);
        }
    }

    /**
     * Cancella selettivamente gli elementi memorizzati nella cache.
     * @param prefixes - Prefissi delle chiavi da rimuovere.
     */
    async clearStoreByPrefixes(prefixes: string[]): Promise<void> {
        if (!prefixes.length) return;

        try {
            const db = await this.getDB();
            const transaction: IDBTransaction = db.transaction([STORE_NAME], 'readwrite');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);
            const request: IDBRequest<IDBCursorWithValue | null> = store.openCursor();

            await new Promise<void>((resolve, reject) => {
                request.onsuccess = (event: Event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                    if (!cursor) {
                        resolve();
                        return;
                    }

                    const key = String(cursor.key);
                    const match = prefixes.some((prefix) => key.includes(prefix));
                    if (match) {
                        cursor.delete();
                    }

                    cursor.continue();
                };

                request.onerror = (event: Event) => {
                    this.logger.error("Errore IndexedDB clearStoreByPrefixes:", (event.target as IDBRequest).error);
                    reject((event.target as IDBRequest).error);
                };
            });
        } catch (error) {
            this.logger.error("Errore IndexedDB (clearStoreByPrefixes):", error);
        }
    }
}