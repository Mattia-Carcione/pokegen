/**
 * Rappresenta un Pokémon nel dominio dell'applicazione.
 * @property id (number) - l'id del pokémon
 * @property baby_trigger_item (any | null) - l'oggetto che innesca la forma baby
 * @property chain (ChainLinkDto) - la catena di evoluzione del pokémon
 */
export interface EvolutionChainDto {
    id: number;
    baby_trigger_item: any | null;
    chain: ChainLinkDto;
}

/**
 * Rappresenta un nodo nella catena evolutiva di un Pokémon.
 * @property is_baby (boolean) - indica se il pokémon è una forma baby
 * @property species (object) - l'oggetto specie del pokémon
 */
export interface ChainLinkDto {
    is_baby: boolean;
    species: { name: string; url: string };
    evolution_details: EvolutionDetailDto[];
    evolves_to: ChainLinkDto[];
}

interface EvolutionDetailDto {
    min_level: number | null;
    trigger: { name: string; url: string };
    item: { name: string; url: string } | null;
    gender: number | null;
    held_item: { name: string; url: string } | null;
    known_move: any | null;
    known_move_type: any | null;
    location: { name: string; url: string } | null;
    min_affection: number | null;
    min_beauty: number | null;
    min_damage_taken: number | null;
    min_happiness: number | null;
    min_move_count: number | null;
    min_steps: number | null;
    needs_multiplayer: boolean;
    needs_overworld_rain: boolean;
    party_species: any | null;
    party_type: any | null;
    relative_physical_stats: number | null;
    time_of_day: string;
    trade_species: any | null;
    turn_upside_down: boolean;
    used_move: any | null;
}
