import GenerationListMockData from "@/../assets/mock_data/resource-list.json";
import PokemonListMockData from "@/../assets/mock_data/pokeapi-list.json";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { PokeApiResponseDto } from "@/shared/data/models/dtos/PokeApiResponseDto";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";

/**
 * Mock Data source per ottenere la lista delle generazioni Pokémon da file JSON locali.
 * Utile per testing e sviluppo senza dipendere dall'API esterna.
 */
export class PokeApiResponseMockDataSource implements IDataSource<PokeApiResponseDto> {
    private generationMockData: PokeApiResponseDto;
    private pokemonMockData: PokeApiResponseDto;

    constructor() {
        this.generationMockData = GenerationListMockData as PokeApiResponseDto;
        this.pokemonMockData = PokemonListMockData as PokeApiResponseDto;
    }

    /**
     * Metodo non applicabile per questo data source.
     * @throws Error sempre, poiché non implementato.
     */
    async fetchData(endpoint: string = EndpointApi.EntryPoint): Promise<PokeApiResponseDto> {
        try {
            // Simula un piccolo delay per replicare il comportamento di una chiamata HTTP
            await new Promise(resolve => setTimeout(resolve, 1500));
            const isGenerationEndpoint = endpoint.includes(EndpointApi.Generation) || endpoint.includes("generation");
            const data = isGenerationEndpoint ? this.generationMockData : this.pokemonMockData;

            // Verifica che i dati mock siano validi
            if (!data || !data.results) {
                throw new Error("Dati mock dell'entry point non validi o mancanti");
            }
            return data;
        } catch (error) {
            throw new ExternalServiceUnavailableError("Errore nel recupero dei dati dell'entry point dal mock." + " \n Dettagli: " + (error as Error).message);
        }
    }


    /**
     * Metodo helper per aggiornare i dati mock durante i test.
     * @param newData - I nuovi dati mock da utilizzare
     */
    setMockData(newData: PokeApiResponseDto, kind: "pokemon" | "generation" = "pokemon"): void {
        if (kind === "generation") {
            this.generationMockData = newData;
            return;
        }
        this.pokemonMockData = newData;
    }
}
