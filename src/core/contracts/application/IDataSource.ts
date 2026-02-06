/**
 * Interfaccia per una sorgente di dati generica.
 */
export interface IDataSource<T> {
    /**
     * Recupera i dati da un endpoint specificato e restituisce una promessa con i dati tipizzati.
     * @param endpoint - L'endpoint da cui recuperare i dati.
     * @returns Una promessa che risolve i dati tipizzati come T.
    */
    fetchData(endpoint?: string, options?: { signal?: AbortSignal, responseType?: string }): Promise<T>;
}