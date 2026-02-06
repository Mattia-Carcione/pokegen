/**
 * Contratto generico per i servizi.
 */
export interface IService<T> {
    /**
     * Esegue il servizio con l'input fornito.
     * @param input L'input per il servizio.
     */
    load(input?: any): Promise<T>;
}
