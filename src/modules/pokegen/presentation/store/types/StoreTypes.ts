import { useGenerationStore } from "../UseGenerationStore";
import { usePokegenStore } from "../UsePokegenStore";
import { usePokeApiStore } from "../UsePokeApiStore";
import { usePokemonTypesStore } from "../UsePokemonTypesStore";

/**
 * Tipo che rappresenta lo store di generazione dei Pokémon.
 */
export type PokegenStore = ReturnType<typeof usePokegenStore>;

/**
 * Tipo che rappresenta lo store di generazione.
 */
export type GenerationStore = ReturnType<typeof useGenerationStore>;

/**
 * Tipo che rappresenta lo store dell'indice Pokémon.
 */
export type PokeApiStore = ReturnType<typeof usePokeApiStore>;

/**
 * Tipo che rappresenta lo store dei tipi Pokémon.
 */
export type PokemonTypesStore = ReturnType<typeof usePokemonTypesStore>;