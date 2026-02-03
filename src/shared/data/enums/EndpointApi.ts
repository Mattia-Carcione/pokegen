/**
 * Enum che definisce gli endpoint API per le risorse dei Pokémon.
 */
export enum EndpointApi {
    EntryPoint = 'pokemon/?limit=1000000',
    Pokemon = 'pokemon/',
    PokemonSpecies = 'pokemon-species/',
    Generation = 'generation/',
    EvolutionChain = 'evolution-chain/',
    TypeList = 'type?limit=1000000',
    Type = 'type/',
}
