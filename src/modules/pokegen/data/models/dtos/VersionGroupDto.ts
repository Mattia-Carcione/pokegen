import { Base, NamedResource } from "@/core/types/CommonTypes";

/**
 * DTO per Version Group.
 */
export interface VersionGroupDto extends Base {
  generation: NamedResource;
  move_learn_methods: NamedResource[];
  order: number;
  pokedexes: NamedResource[];
  regions: NamedResource[];
  versions: NamedResource[];
}
