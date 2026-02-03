/**
 * Rappresenta un Pokémon nel dominio dell'applicazione.
 */
export interface PokemonMoveDetail {
  versionGroup: string;
  method: string;
  level: number;
}

/**
 * Rappresenta un Pokémon nel dominio dell'applicazione.
 */
export interface PokemonMove {
  slug: string;
  name: string;
  details: PokemonMoveDetail[];
}
