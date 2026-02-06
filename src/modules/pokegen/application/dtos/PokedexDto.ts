import { Base, NamedResource, Names } from "@/commons/types/CommonTypes";

/**
 * Rappresenta il Data Transfer Object (DTO) di un Pokédex regionale.
 * Basato sulla risposta dell'endpoint /pokedex/
 */
export interface PokedexDto extends Base {
    /** Se questo Pokédex appartiene alla serie principale di giochi */
    is_main_series: boolean;
    /** Descrizioni localizzate del Pokédex */
    descriptions: PokedexDescription[];
    /** Elenco dei nomi localizzati del Pokédex */
    names: Names[];
    /** Elenco dei Pokémon contenuti in questo Pokédex */
    pokemon_entries: PokemonEntry[];
    /** La regione a cui è associato questo Pokédex */
    region: NamedResource | null;
    /** Gruppi di versioni dei giochi a cui questo Pokédex è associato */
    version_groups: NamedResource[];
}

// --- Sotto-interfacce di supporto ---

/**
 * Rappresenta una voce specifica all'interno del Pokédex.
 */
interface PokemonEntry {
    /** Il numero di iscrizione (entry number) del Pokémon in questo Pokédex specifico */
    entry_number: number;
    /** La specie di Pokémon associata a questa voce */
    pokemon_species: NamedResource;
}

/**
 * Rappresenta una descrizione localizzata del Pokédex.
 */
interface PokedexDescription {
    /** Il testo descrittivo */
    description: string;
    /** La lingua della descrizione */
    language: NamedResource;
}