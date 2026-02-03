import { NamedResource } from "@/core/types/CommonTypes";

/**
 * DTO per i dati dei tipi Pokémon come definiti dalla PokeAPI.
 */
export interface TypeDto {
  id: number;
  name: string;
  pokemon: Array<{
    slot: number;
    pokemon: NamedResource;
  }>;
}
