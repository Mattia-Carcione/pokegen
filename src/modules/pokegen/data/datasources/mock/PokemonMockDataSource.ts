import pokemonMockData from "@/../assets/mock_data/pokemon.json";
import pokemonListMockData from "@/../assets/mock_data/pokemon-list.json";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { PokemonDto } from "@/modules/pokegen/data/models/dtos/PokemonDto";

/**
 * Mock Data source per ottenere i dati dei Pokémon da file JSON locali.
 * Utile per testing e sviluppo senza dipendere dall'API esterna.
 */
export class PokemonMockDataSource implements IDataSource<PokemonDto> {
    private mockData: PokemonDto;
    private listMockData: PokemonDto[];

    constructor() {
        this.mockData = pokemonMockData as PokemonDto;
        this.listMockData = pokemonListMockData as PokemonDto[];
    }
    
    /**
     * Recupera i dati del Pokémon da mock data locale.
     * @param endpoint - L'endpoint (ignorato nel mock, ritorna sempre lo stesso Pokémon)
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come PokemonDto
     * 
     * @throws DataSourceError se il recupero dei dati fallisce
     */
    async fetchData(endpoint: string): Promise<PokemonDto> {
        try {
            // Simula un piccolo delay per replicare il comportamento di una chiamata HTTP
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const normalized = this.normalizeEndpoint(endpoint);
            const byName = this.listMockData.find((p) => p.name?.toLowerCase() === normalized);
            if (byName) return byName;

            const byId = this.listMockData.find((p) => String(p.id) === normalized);
            if (byId) return byId;

            // Fallback ai dati singoli mock se non presente nella lista
            if (!this.mockData || !this.mockData.id) {
                throw new Error("Dati mock non validi o mancanti");
            }

            return this.mockData;
        } catch (error) {
            throw new ExternalServiceUnavailableError("Errore nel recupero dei dati del Pokémon dal mock." + " \n Dettagli: " + (error as Error).message);
        }
    }

    /**
     * Metodo helper per aggiornare i dati mock durante i test.
     * @param newData - I nuovi dati mock da utilizzare
     */
    setMockData(newData: PokemonDto): void {
        this.mockData = newData;
    }

    private normalizeEndpoint(endpoint: string): string {
        const value = endpoint.trim().toLowerCase();
        const cleaned = value.replace(/\/+$/, "");

        const parts = cleaned.split("/pokemon/");
        const last = parts[parts.length - 1];
        return last.replace(/\/+$/, "");
    }
}
