import { safeFetch } from "@/core/utils/async/SafeFetch";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { ISpriteEnricherService } from "./contracts/ISpriteEnricherService";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ServiceError } from "@/core/errors/ServiceError";

/**
 * Servizio per l'arricchimento delle sprite di evoluzione dei Pokémon.
 */
export class EvolutionSpriteEnricherService implements ISpriteEnricherService {
    constructor(
        private readonly repository: IPokemonRepository,
        private readonly logger: ILogger,
    ) { }

    /**
     * Arricchisce le sprite di evoluzione per il Pokémon fornito.
     * @param input Il Pokémon da arricchire con le sprite di evoluzione.
     */
    async enrich(input: Pokemon): Promise<void> {
        this.logger.debug("[EvolutionSpriteEnricherService] - Esecuzione del servizio per ottenere i dati dell'evoluzione del Pokémon: " + input.name);
        if (!input.evolution?.length) return;
        const names = new Set<string>();

        try {
            input.evolution.forEach(e => {
                names.add(e.from); names.add(e.to);
            });
            const fetcher = (name: string) => this.repository.getAsync(name);
            const inputs = await Promise.all([...names]
                .map(n => safeFetch<Pokemon>(fetcher, n)));
            const map = new Map(inputs?.filter(Boolean)
                .map(p => [p?.nameSpecies, p]));

            input.evolution.forEach(e => {
                e.spriteFrom = map.get(e.from)?.sprite;
                e.spriteTo = map.get(e.to)?.sprite;
            });
        } catch (error) {
            throw new ServiceError("[EvolutionSpriteEnricherService] - Error during execute enrich service: " + (error as Error).message, (error as Error))
        }
    }
}
