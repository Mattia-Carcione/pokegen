/**
 * ViewModel rappresentante un'evoluzione del Pokémon.
 */
export interface PokemonEvolutionVM {
    to: string;           // nome Pokémon evoluto (serve ancora per link/sprite)
    sprite: string;       // sprite del Pokémon
    href: { name: string; params: { name: string } }; // link al Pokémon
    info: string[];       // tutte le info testuali già pronte per UI
}

/**
 * ViewModel rappresentante uno stadio di evoluzione del Pokémon.
 */
export interface EvolutionStageVM {
    pokemons: { name: string; sprite?: string, href:  { name: string; params: { name: string } }};
    evolutions?: PokemonEvolutionVM[];
}
