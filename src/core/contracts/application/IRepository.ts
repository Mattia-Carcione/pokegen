/**
 * Interfaccia per il repository di generazione dei Pokémon.
 */
export interface IRepository<T> {
    /**
     * Recupera i dati da un endpoint specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati
     * @returns Una promessa che risolve i dati tipizzati come T
    */
    getAllAsync(): Promise<T[]>;

    /**
     * Recupera il singolo dato da un endpoint specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati
     * @returns Una promessa che risolve i dati tipizzati come T
     */
    getAsync(id: string): Promise<T>;
}