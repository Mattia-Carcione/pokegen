import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { IPokemonSpriteProvider } from "./contracts/IPokemonSpriteProvider";

/**
 * Provider per ottenere le sprite dei Pokémon utilizzando il repository dei Pokémon.
 */
export class PokemonSpriteProvider implements IPokemonSpriteProvider {
  constructor(
    private readonly pokemonRepository: IPokemonRepository
  ) {}

  /**
   * Recupera la sprite di un Pokémon dato il suo URL.
   * @param url L'URL del Pokémon.
   * @returns Una promessa che risolve la sprite del Pokémon o undefined se non trovata.
   */
  async getSpriteByPokemonUrl(url: string): Promise<string> {
    const pokemon = await this.pokemonRepository.getAsync(url);
    return pokemon.sprite;
  }
}
