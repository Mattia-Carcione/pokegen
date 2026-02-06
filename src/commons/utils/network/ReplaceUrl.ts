export class NetworkHelper {
    private constructor() { }
    
    /**
     * Funzione per verificare e completare un endpoint con la BASE_URI se necessario.
     * @param endpoint L'endpoint da verificare.
     * @param BASE_URI La base URI da aggiungere se l'endpoint non è completo.
     * @returns L'endpoint completo.
     */
    static replaceUrl(endpoint: string, BASE_URI: string): string {
        const startsWithHttp = endpoint.startsWith("http");
    
        if (!startsWithHttp)
            endpoint = BASE_URI + endpoint;
    
        return endpoint;
    }
    
    /**
     * Funzione per estrarre un ID numerico da un URL che segue un pattern specifico.
     * @param url L'URL da analizzare.
     * @param uri La parte dell'URI da cercare (es. "generation", "pokemon", ecc.).
     * @returns L'ID numerico estratto o 0 se il pattern non corrisponde.
     */
    static matchUrlPattern(url: string, uri: string): number {
        const idMatch = url.match(new RegExp(`/\/${uri}\/(\d+)\//`));
        if (!idMatch) return 0;
        return Number(idMatch[1]);
    }
}