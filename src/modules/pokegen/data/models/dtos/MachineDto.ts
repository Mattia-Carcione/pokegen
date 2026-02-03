import { Base, NamedResource } from "@/core/types/CommonTypes";

export interface MachineDto extends Base {
  item: NamedResource;
  move: NamedResource;
  version_group: NamedResource;
}
