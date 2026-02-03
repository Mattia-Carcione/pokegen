import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { NamedResource } from "@/core/types/CommonTypes";

/**
 * Interfaccia per il caso d'uso di recupero della lista dei tipi Pokémon.
 */
export interface IGetPokemonTypesUseCase extends IUseCaseBase<NamedResource[]> { }
