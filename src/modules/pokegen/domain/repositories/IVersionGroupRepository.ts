import { IRepository } from "@/core/contracts/data/IRepository";
import { NamedResource } from "@/core/types/CommonTypes";

/**
 * Interfaccia Repository per la lista dei version-group.
 */
export interface IVersionGroupRepository extends IRepository<NamedResource> { }
