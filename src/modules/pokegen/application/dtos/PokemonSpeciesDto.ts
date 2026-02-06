import { NamedResource } from "@/commons/types/CommonTypes";

/**
 * Rappresenta il Data Transfer Object (DTO) della specie di un Pokémon come definito dalla PokeAPI.
 */
export interface PokemonSpeciesDto {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: NamedResource;
  pokedex_numbers: PokedexNumber[];
  egg_groups: NamedResource[];
  color: NamedResource;
  shape: NamedResource;
  evolves_from_species: NamedResource | null;
  evolution_chain: EvolutionChainLink;
  habitat: NamedResource | null;
  generation: NamedResource;
  names: NameEntry[];
  flavor_text_entries: FlavorTextEntry[];
  form_descriptions: FormDescription[];
  genera: GenusEntry[];
  varieties: PokemonVariety[];
  pal_park_encounters: PalParkEncounter[];
}

// --- Sotto-interfacce di supporto ---
/**
 * Rappresenta un numero del Pokédex per una specie di Pokémon.
 */
interface PokedexNumber {
  entry_number: number;
  pokedex: NamedResource;
}
/** 
 * Rappresenta il collegamento alla catena di evoluzione di una specie di Pokémon.
 */
interface EvolutionChainLink {
  url: string;
}
/**
 * Rappresenta una voce di nome per una specie di Pokémon.
 */
interface NameEntry {
  name: string;
  language: NamedResource;
}
/**
 * Rappresenta una voce di testo descrittivo per una specie di Pokémon.
 */
interface FlavorTextEntry {
  flavor_text: string;
  language: NamedResource;
  version: NamedResource;
}
/**
 * Rappresenta un genere per una specie di Pokémon.
 */
interface GenusEntry {
  genus: string;
  language: NamedResource;
}
/**
 * Rappresenta una descrizione di una forma di una specie di Pokémon.
 */
interface FormDescription {
  description: string;
  language: NamedResource;
}
/**
 * Rappresenta una varietà di una specie di Pokémon.
 */
interface PokemonVariety {
  is_default: boolean;
  pokemon: NamedResource;
}
/**
 * Rappresenta un incontro nel Parco Pal.
 */
interface PalParkEncounter {
  area: NamedResource;
  base_score: number;
  rate: number;
}