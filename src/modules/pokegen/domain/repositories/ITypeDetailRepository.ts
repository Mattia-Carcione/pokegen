import { IRepository } from "@/core/contracts/data/IRepository";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";

/**
 * Interfaccia Repository per la lista dettagliata dei tipi Pokémon.
 */
export interface ITypeDetailRepository extends IRepository<TypeDto> { }
