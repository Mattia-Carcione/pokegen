import { IRepository } from "@/core/contracts/data/IRepository";
import { VersionGroupInfo } from "@/modules/pokegen/domain/entities/VersionGroupInfo";

/**
 * Interfaccia Repository per la lista dettagliata dei version-group.
 */
export interface IVersionGroupDetailRepository extends IRepository<VersionGroupInfo> { }
