import { Base, NamedResource } from "@/commons/types/CommonTypes";

/**
 * Rappresenta il Data Transfer Object (DTO) di un Pokémon come definito dalla PokeAPI.
 */
export interface PokemonDto extends Base {
  order: number;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  abilities: PokemonAbility[];
  forms: NamedResource[];
  game_indices: GameIndex[];
  held_items: HeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];
  species: NamedResource;
  sprites: Sprites;
  stats: PokemonStat[];
  types: PokemonType[];
  past_abilities: PastAbility[];
  cries: Cries;
}

// --- Sotto-interfacce di supporto ---

/**
 * Rappresenta un'abilità di un Pokémon.
 */
interface PokemonAbility {
  ability: NamedResource;
  is_hidden: boolean;
  slot: number;
}

/**
 * Rappresenta un indice di gioco per un Pokémon.
 */
interface GameIndex {
  game_index: number;
  version: NamedResource;
}

/**
 * Rappresenta un oggetto tenuto da un Pokémon.
 */
interface HeldItem {
  item: NamedResource;
  version_details: HeldItemVersionDetail[];
}

/**
 * Rappresenta una mossa di un Pokémon.
 */
interface HeldItemVersionDetail {
  rarity: number;
  version: NamedResource;
}

/**
 * Rappresenta una mossa di un Pokémon.
 */
interface PokemonMove {
  move: NamedResource;
  version_group_details: MoveVersionGroupDetail[];
}

/**
 * Rappresenta i dettagli di una mossa in un gruppo di versioni.
 */
interface MoveVersionGroupDetail {
  level_learned_at: number;
  move_learn_method: NamedResource;
  version_group: NamedResource;
}

/**
 * Rappresenta una statistica di un Pokémon.
 */
interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedResource;
}

/**
 * Rappresenta un tipo di un Pokémon.
 */
interface PokemonType {
  slot: number;
  type: NamedResource;
}

/**
 * Rappresenta un'abilità passata di un Pokémon.
 */
interface PastAbility {
  abilities: {
    ability: NamedResource | null;
    is_hidden: boolean;
    slot: number;
  }[];
  generation: NamedResource;
}

/** 
 * Rappresenta i versi di un Pokémon.
 */
interface Cries {
  latest: string;
  legacy: string;
}

/**
 * Rappresenta gli sprite di un Pokémon.
 */
interface Sprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other?: {
    dream_world: { front_default: string | null; front_female: string | null };
    home: { front_default: string | null; front_female: string | null; front_shiny: string | null; front_shiny_female: string | null };
    "official-artwork": { front_default: string | null; front_shiny: string | null };
    showdown: { [key: string]: string | null };
  };
  versions?: {
    [generation: string]: {
      [version: string]: { [key: string]: any };
    };
  };
}