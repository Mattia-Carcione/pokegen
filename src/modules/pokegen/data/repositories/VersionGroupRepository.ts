import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { NamedResource } from "@/core/types/CommonTypes";
import { PokeApiResponseDto } from "@/shared/data/models/dtos/PokeApiResponseDto";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";
import { IVersionGroupRepository } from "@/modules/pokegen/domain/repositories/IVersionGroupRepository";
import { NotImplementedError } from "@/core/errors/NotImplementedError";

/**
 * Repository per la lista dei version-group.
 */
export class VersionGroupRepository implements IVersionGroupRepository {
  protected readonly className = "VersionGroupRepository";

  constructor(
    private readonly pokeApiResponseDataSource: IDataSource<PokeApiResponseDto>,
    private readonly cache: ICache<NamedResource[]>,
    private readonly logger: ILogger
  ) {}

  /**
   * Metodo non implementato per recuperare un singolo version-group.
   * @throws NotImplementedError
   */
  async getAsync(): Promise<NamedResource> {
    throw new NotImplementedError("[VersionGroupRepository] - getAsync method is not implemented.");
  }

  /**
   * Recupera tutti i version-group.
   * @returns Una promessa che risolve un array di NamedResource
   */
  async getAllAsync(): Promise<NamedResource[]> {
    this.logger.debug(`[${this.className}] - Fetching version-group list`);

    const key = this.cache.generateKey(this.className, "getAllAsync", "all_version_groups");
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Version-group list found in cache`);
      return cached;
    }

    this.logger.debug(`[${this.className}] - Cache miss, fetching version-group list`);
    const response = await this.pokeApiResponseDataSource.fetchData(EndpointApi.VersionGroupList);
    this.cache.set(key, response.results, 1000 * 60 * 60);
    return response.results;
  }
}
