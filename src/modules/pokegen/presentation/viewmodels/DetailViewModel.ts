import { PokemonVM } from "./types/PokemonVM";
import { TypeEffectivenessVM } from "./types/TypeEffectivenessVM";

/**
 * Tipo di ViewModel per i dettagli di un Pokémon.
 * Contiene le informazioni dettagliate del Pokémon e i riferimenti ai Pokémon precedente e successivo.
 * 
 * @property PokemonVM - I dettagli del Pokémon.
 * @property prev - Il Pokémon precedente, o null se non esiste.
 * @property next - Il Pokémon successivo, o null se non esiste.
 */
export class DetailViewModel {
    constructor(
        public readonly pokemon: PokemonVM,
        public readonly prev: PokemonVM | null,
        public readonly next: PokemonVM | null,
        public readonly typeEffectiveness: TypeEffectivenessVM | null,
    ) {}
}