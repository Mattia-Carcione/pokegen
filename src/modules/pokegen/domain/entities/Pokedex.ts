import { NamedResource } from "@/commons/types/CommonTypes";

export class Pokedex {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly pokemon: NamedResource[],
        public readonly region: string,
        public readonly versionGroups: NamedResource[]
    ) { }
}
