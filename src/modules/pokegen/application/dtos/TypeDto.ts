import { NamedResource } from "@/commons/types/CommonTypes";

/**
 * DTO per i dati dei tipi Pokémon come definiti dalla PokeAPI.
 */
export interface TypeDto {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: NamedResource[];
    double_damage_to: NamedResource[];
    half_damage_from: NamedResource[];
    half_damage_to: NamedResource[];
    no_damage_from: NamedResource[];
    no_damage_to: NamedResource[];
  };
  pokemon: Array<{
    slot: number;
    pokemon: NamedResource;
  }>;
}
