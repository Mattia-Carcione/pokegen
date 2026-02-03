import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { IGetPokemonByTypeUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonByTypeUseCase";
import { ITypePokemonRepository } from "@/modules/pokegen/domain/repositories/ITypePokemonRepository";

/**
 * Use case per recuperare i Pokémon per tipo.
 */
export class GetPokemonByTypeUseCase implements IGetPokemonByTypeUseCase {
  constructor(
    private readonly typePokemonRepository: ITypePokemonRepository,
    private readonly logger: ILogger
  ) { }

  /**
   * Esegue il use case per ottenere i Pokémon associati a un tipo.
   * @param input - Nome del tipo.
   * @returns Una Promise che risolve la lista dei Pokémon o un errore.
   */
  async execute(input: string): Promise<Result<Pokemon[], Error>> {
    this.logger.debug("[GetPokemonByTypeUseCase] - Esecuzione del use case per ottenere i Pokémon per tipo: " + input);
    try {
      const data = await this.typePokemonRepository.getByTypeAsync(input);
      return new Result<Pokemon[], Error>(true, data, null);
    } catch (error) {
      return new Result<Pokemon[], Error>(false, null, error as Error);
    }
  }
}
