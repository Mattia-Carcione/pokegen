import { Base, NamedResource } from "@/commons/types/CommonTypes";

export interface MoveDto extends Base {
  accuracy: number | null;
  power: number | null;
  pp: number | null;
  type: NamedResource;
  damage_class: NamedResource;
  machines?: { machine: NamedResource; version_group: NamedResource }[];
}
