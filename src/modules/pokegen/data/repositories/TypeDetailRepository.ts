import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
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
    private readonly cache: ICache<TypeDto[] | TypeDto>,
    private readonly logger: ILogger
  ) { }

  /**
   * Metodo non implementato per recuperare un singolo tipo.
   */
  async getAsync(type: string): Promise<TypeDto> {
    this.logger.debug(`[${this.className}] - Fetching detailed type: ${type}`);

    const key = this.cache.generateKey(this.className, "getAsync", type);
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Detailed type found in cache: ${type}`);
      return cached as unknown as TypeDto;
    }

    this.logger.debug(`[${this.className}] - Cache miss, fetching detailed type: ${type}`);
    const detail = await this.typeDataSource.fetchData(type);
    this.cache.set(key, detail, 1000 * 60 * 60);
    return detail;
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
      return cached as unknown as TypeDto[];
    }

    this.logger.debug(`[${this.className}] - Cache miss, fetching detailed types list`);
    const list = await this.typeRepository.getAllAsync();
    const task = list.map(async (type) => this.typeDataSource.fetchData(type.url));
    const details = await Promise.all(task);

    this.cache.set(key, details, 1000 * 60 * 60);
    return details;
  }
}
