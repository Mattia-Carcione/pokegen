import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { NotImplementedError } from "@/core/errors/NotImplementedError";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { ITypeDetailRepository } from "@/modules/pokegen/domain/repositories/ITypeDetailRepository";
import { ITypeRepository } from "@/modules/pokegen/domain/repositories/ITypeRepository";

/**
 * Repository per ottenere la lista dettagliata dei tipi Pokémon.
 */
export class TypeDetailRepository implements ITypeDetailRepository {
  protected readonly className = "TypeDetailRepository";

  constructor(
    private readonly typeRepository: ITypeRepository,
    private readonly typeDataSource: IDataSource<TypeDto>,
    private readonly cache: ICache<TypeDto[]>,
    private readonly logger: ILogger
  ) { }

  /**
   * Metodo non implementato per recuperare un singolo tipo.
   * @throws NotImplementedError
   */
  async getAsync(): Promise<TypeDto> {
    throw new NotImplementedError("[TypeDetailRepository] - getAsync method is not implemented.");
  }

  /**
   * Recupera la lista dettagliata dei tipi Pokémon.
   * @returns Una promessa che risolve un array di TypeDto
   */
  async getAllAsync(): Promise<TypeDto[]> {
    this.logger.debug(`[${this.className}] - Fetching detailed types list`);

    const key = this.cache.generateKey(this.className, "getAllAsync", "all_type_details");
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Detailed types list found in cache`);
      return cached;
    }

    this.logger.debug(`[${this.className}] - Cache miss, fetching detailed types list`);
    const list = await this.typeRepository.getAllAsync();
    const task = list.map(async (type) => this.typeDataSource.fetchData(type.url));
    const details = await Promise.all(task);

    this.cache.set(key, details, 1000 * 60 * 60);
    return details;
  }
}
