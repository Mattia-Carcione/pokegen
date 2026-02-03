import { PokemonEvolution } from "../types/PokemonEvolution";
import { PokemonMove } from "../types/PokemonMove";

/**
 * Rappresenta un Pokémon nel dominio dell'applicazione.
 * @property id (number) - l'id del pokémon
 * @property name (string) - il nome del pokémon
 * @property types (string[]) - i tipi del pokémon
 * @property sprite (string) - il percorso dell'immagine del pokémon
 */
export class Pokemon {
    constructor (
        public readonly id: number,
        public readonly name: string,
        public readonly nameSpecies: string,
        public readonly types: { slot: number; name: string; url: string; }[],
        public readonly height: number,
        public readonly weight: number,
        public readonly stats: { name: string; base: number }[],
        public readonly sprite: string,
    ) {};
    
    public genderRate?: number;
    public flavorText?: { version: string; text: string }[];
    public captureRate?: number;
    public generation?: string;
    public genus?: string;
    public evolution?: PokemonEvolution[];
    public varieties?: { is_default: boolean; pokemon: { name: string; url: string; sprite?: string }; }[];
    public abilities?: { slot: number; name: string; isHidden: boolean; }[];
    public moves?: PokemonMove[];
}