import { NamedResource } from "@/commons/types/CommonTypes";

export class Generation {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly abilities: NamedResource[],
        public readonly mainRegion: NamedResource,
        public readonly moves: NamedResource[],
        public readonly pokemonSpecies: NamedResource[],
        public readonly types: NamedResource[],
        public readonly versionGroups: NamedResource[],
        public readonly pokedexId: number
    ) { }
}