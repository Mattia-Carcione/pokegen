import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { IGetPokemonTypesDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonTypesDetailUseCase";
import { ITypeDetailRepository } from "@/modules/pokegen/domain/repositories/ITypeDetailRepository";

/**
 * Use case per recuperare la lista dettagliata dei tipi Pokémon.
 */
export class GetPokemonTypesDetailUseCase implements IGetPokemonTypesDetailUseCase {
  constructor(
    private readonly typeDetailRepository: ITypeDetailRepository,
    private readonly logger: ILogger
  ) { }

  /**
   * Esegue il use case per ottenere la lista dettagliata dei tipi.
   * @returns Una Promise che risolve la lista dei tipi o un errore.
   */
  async execute(): Promise<Result<TypeDto[], Error>> {
    this.logger.debug("[GetPokemonTypesDetailUseCase] - Esecuzione del use case per ottenere la lista dettagliata dei tipi Pokémon");
    try {
      const data = await this.typeDetailRepository.getAllAsync();
      return new Result<TypeDto[], Error>(true, data, null);
    } catch (error) {
      return new Result<TypeDto[], Error>(false, null, error as Error);
    }
  }
}
