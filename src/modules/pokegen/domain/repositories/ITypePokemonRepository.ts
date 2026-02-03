import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

/**
 * Interfaccia Repository per ottenere i Pokémon per tipo.
 */
export interface ITypePokemonRepository {
  /**
   * Recupera i Pokémon associati a un tipo.
   * @param type - Il nome del tipo.
   */
  getByTypeAsync(type: string): Promise<Pokemon[]>;
}
