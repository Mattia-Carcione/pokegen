import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

/**
 * Contratto per il servizio di arricchimento delle sprite dei Pokémon.
 */
export interface ISpriteEnricherService {
    /**
     * Arricchisce le sprite per il Pokémon fornito.
     * @param input Il Pokémon da arricchire con le sprite.
     */
    enrich(input: Pokemon): Promise<void>
}
