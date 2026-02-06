import { Base, NamedResource, Names } from "@/commons/types/CommonTypes";

/**
 * Rappresenta il Data Transfer Object (DTO) di una Generazione Pokémon.
 * Basato sulla risposta dell'endpoint /generation/
 */
export interface GenerationDto extends Base {
    /** Elenco delle abilità introdotte in questa generazione (vuoto per la Gen I nel JSON) */
    abilities: NamedResource[];
    /** La regione principale associata a questa generazione */
    main_region: NamedResource;
    /** Elenco delle mosse introdotte in questa generazione */
    moves: NamedResource[];
    /** Elenco dei nomi localizzati della generazione */
    names: Names[];
    /** Elenco delle specie di Pokémon introdotte in questa generazione */
    pokemon_species: NamedResource[];
    /** Elenco dei tipi di Pokémon introdotti in questa generazione */
    types: NamedResource[];
    /** Gruppi di versioni dei giochi che appartengono a questa generazione */
    version_groups: NamedResource[];
}