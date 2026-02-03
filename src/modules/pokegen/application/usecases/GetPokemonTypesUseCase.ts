import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { NamedResource } from "@/core/types/CommonTypes";
import { IGetPokemonTypesUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonTypesUseCase";
import { ITypeRepository } from "@/modules/pokegen/domain/repositories/ITypeRepository";

/**
 * Use case per recuperare la lista dei tipi Pokémon.
 */
export class GetPokemonTypesUseCase implements IGetPokemonTypesUseCase {
  constructor(
    private readonly typeRepository: ITypeRepository,
    private readonly logger: ILogger
  ) { }

  /**
   * Esegue il use case per ottenere la lista dei tipi.
   * @returns Una Promise che risolve la lista dei tipi o un errore.
   */
  async execute(): Promise<Result<NamedResource[], Error>> {
    this.logger.debug("[GetPokemonTypesUseCase] - Esecuzione del use case per ottenere la lista dei tipi Pokémon");
    try {
      const data = await this.typeRepository.getAllAsync();
      return new Result<NamedResource[], Error>(true, data, null);
    } catch (error) {
      return new Result<NamedResource[], Error>(false, null, error as Error);
    }
  }
}
