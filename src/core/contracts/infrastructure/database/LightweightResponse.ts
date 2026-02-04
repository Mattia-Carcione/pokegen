/**
 * Interfaccia per l'oggetto risposta leggera salvato in IndexedDB.
 * Deve contenere solo dati serializzabili (senza riferimenti ciclici o complessi).
 */
export interface LightweightResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: { url?: string; method?: string };
}