import { IRepository } from "@/core/contracts/data/IRepository";
import { NamedResource } from "@/core/types/CommonTypes";

/**
 * Interfaccia Repository per la lista dei tipi Pokémon.
 */
export interface ITypeRepository extends IRepository<NamedResource> { }
