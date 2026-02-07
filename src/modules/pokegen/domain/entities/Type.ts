import { NamedResource } from "@/commons/types/CommonTypes";

export interface TypeDamageRelations {
    doubleDamageFrom: NamedResource[];
    doubleDamageTo: NamedResource[];
    halfDamageFrom: NamedResource[];
    halfDamageTo: NamedResource[];
    noDamageFrom: NamedResource[];
    noDamageTo: NamedResource[];
}

export interface TypePokemonEntry {
    slot: number;
    pokemon: NamedResource;
}

export class Type {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly category: NamedResource,
        public readonly moves: NamedResource[],
        public readonly damageRelations: TypeDamageRelations,
        public readonly pokemon: TypePokemonEntry[]
    ) { }
}
