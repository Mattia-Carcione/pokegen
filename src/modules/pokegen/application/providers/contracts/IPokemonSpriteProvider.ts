/**
 * Interfaccia per il provider di sprite dei Pokémon.
 * @interface IPokemonSpriteProvider
 * @method getSpriteByPokemonUrl - Recupera la sprite di un Pokémon dato il suo URL.
 */
export interface IPokemonSpriteProvider {
    /**
     * Recupera la sprite di un Pokémon dato il suo URL.
     * @param url L'URL del Pokémon.
     * @returns Una promessa che risolve la sprite del Pokémon.
     */
    getSpriteByPokemonUrl(url: string): Promise<string>;
}
