import { EvolutionStageVM } from "./EvolutionStageVM";

/**
 * ViewModel rappresentante un Pokémon.
 */
export interface PokemonVM {
    id: string;
    pokedexNumber: string;
    name: string;
    types: { color: string; icon: string; name: string }[];
    sprite: string;
    href: { name: string; params: { name: string } };
    height?: number;
    weight?: number;
    stats?: { name: string; base: number }[];
    genderRate?: { male: number; female: number; };
    flavorText?: { version: string; text: string }[];
    captureRate?: number;
    generation?: { href: { name: string; params: { id: number } }, name: string };
    genus?: string;
    evolution?: EvolutionStageVM[];
    abilities?: { slot: string; name: string; isHidden: boolean; }[];
    varieties?: { isDefault: boolean; pokemon: { name: string; sprite: string; href: { name: string; params: { name: string } } } }[];
    eggGroups?: { name: string; href: { name: string; params: { name: string } } }[];
    moves?: { slug: string; name: string; details: { level: number; method: string; versionGroup: string }[] }[];
}