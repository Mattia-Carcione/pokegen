import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { NamedResource } from "@/core/types/CommonTypes";
import { PokeApiResponseDto } from "@/shared/data/models/dtos/PokeApiResponseDto";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";
import { ITypeRepository } from "@/modules/pokegen/domain/repositories/ITypeRepository";
import { NotImplementedError } from "@/core/errors/NotImplementedError";

/**
 * Repository per la lista dei tipi Pokémon.
 */
export class TypeRepository implements ITypeRepository {
  protected readonly className = "TypeRepository";

  constructor(
    private readonly pokeApiResponseDataSource: IDataSource<PokeApiResponseDto>,
    private readonly cache: ICache<NamedResource[]>,
    private readonly logger: ILogger
  ) { }

  /**
   * Metodo non implementato per recuperare un singolo tipo.
   * @throws NotImplementedError
   */
  async getAsync(): Promise<NamedResource> {
    throw new NotImplementedError("[TypeRepository] - getAsync method is not implemented.");
  }

  /**
   * Recupera tutti i tipi Pokémon.
   * @returns Una promessa che risolve un array di NamedResource
   */
  async getAllAsync(): Promise<NamedResource[]> {
    this.logger.debug(`[${this.className}] - Fetching types list`);

    const key = this.cache.generateKey(this.className, "getAllAsync", "all_types");
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Types list found in cache`);
      return cached;
    }

    this.logger.debug(`[${this.className}] - Cache miss, fetching types list`);
    const response = await this.pokeApiResponseDataSource.fetchData(EndpointApi.TypeList);
    this.cache.set(key, response.results, 1000 * 60 * 60);
    return response.results;
  }
}
