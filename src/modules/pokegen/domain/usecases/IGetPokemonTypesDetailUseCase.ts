import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";

/**
 * Interfaccia per il caso d'uso di recupero della lista dettagliata dei tipi Pokémon.
 */
export interface IGetPokemonTypesDetailUseCase extends IUseCaseBase<TypeDto[]> { }
