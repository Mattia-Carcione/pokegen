import { Base, NamedResource } from "@/commons/types/CommonTypes";

export interface MachineDto extends Base {
  item: NamedResource;
  move: NamedResource;
  version_group: NamedResource;
}
