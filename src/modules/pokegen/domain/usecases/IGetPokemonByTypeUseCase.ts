import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

/**
 * Interfaccia per il caso d'uso di recupero dei Pokémon per tipo.
 */
export interface IGetPokemonByTypeUseCase extends IUseCaseBase<Pokemon[]> { }
