/**
 * Esegue una fetch sicura di un endpoint numerico, restituendo null in caso di errore o input non valido.
 * @param input - L'input numerico per l'endpoint
 * @param fetcher - La funzione di fetch da utilizzare
 * @returns Una promessa che risolve il risultato della fetch o null
 */
export async function safeFetch<T>(fetcher: (endpoint?: any) => Promise<T>, endpoint?: any): Promise<T | null> {
    try {
        return await fetcher(endpoint);
    } catch (error) {
        return null;
    }
}