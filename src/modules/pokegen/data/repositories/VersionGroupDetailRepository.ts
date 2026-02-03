import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { VersionGroupDto } from "@/modules/pokegen/data/models/dtos/VersionGroupDto";
import { IVersionGroupDetailRepository } from "@/modules/pokegen/domain/repositories/IVersionGroupDetailRepository";
import { IVersionGroupRepository } from "@/modules/pokegen/domain/repositories/IVersionGroupRepository";
import { VersionGroupInfo } from "@/modules/pokegen/domain/entities/VersionGroupInfo";

/**
 * Repository per ottenere la lista dettagliata dei version-group.
 */
export class VersionGroupDetailRepository implements IVersionGroupDetailRepository {
  protected readonly className = "VersionGroupDetailRepository";

  constructor(
    private readonly versionGroupRepository: IVersionGroupRepository,
    private readonly versionGroupDataSource: IDataSource<VersionGroupDto>,
    private readonly cache: ICache<VersionGroupInfo[] | VersionGroupInfo>,
    private readonly logger: ILogger
  ) {}

  /**
   * Recupera un singolo version-group dettagliato.
   * @param name - Il nome del version-group.
   * @returns Una promessa che risolve un VersionGroupInfo
   */
  async getAsync(name: string): Promise<VersionGroupInfo> {
    this.logger.debug(`[${this.className}] - Fetching detailed version-group: ${name}`);

    const key = this.cache.generateKey(this.className, "getAsync", name);
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Detailed version-group found in cache: ${name}`);
      return cached as VersionGroupInfo;
    }

    this.logger.debug(`[${this.className}] - Cache miss, fetching detailed version-group: ${name}`);
    const detail = await this.versionGroupDataSource.fetchData(name);
    const mapped = this.mapDetail(detail);
    this.cache.set(key, mapped, 1000 * 60 * 60);
    return mapped;
  }

  /**
   * Recupera la lista dettagliata dei version-group.
   * @returns Una promessa che risolve un array di VersionGroupInfo
   */
  async getAllAsync(): Promise<VersionGroupInfo[]> {
    this.logger.debug(`[${this.className}] - Fetching detailed version-group list`);

    const key = this.cache.generateKey(this.className, "getAllAsync", "all_version_groups_detail");
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Detailed version-group list found in cache`);
      return cached as VersionGroupInfo[];
    }

    this.logger.debug(`[${this.className}] - Cache miss, fetching detailed version-group list`);
    const list = await this.versionGroupRepository.getAllAsync();
    const task = list.map(async (item) => this.versionGroupDataSource.fetchData(item.url));
    const details = await Promise.all(task);
    const mapped = details.map((detail) => this.mapDetail(detail));

    this.cache.set(key, mapped, 1000 * 60 * 60);
    return mapped;
  }

  private mapDetail(detail: VersionGroupDto): VersionGroupInfo {
    return new VersionGroupInfo(
      detail.name,
      detail.generation?.name ?? "",
      detail.versions.map((v) => v.name),
      detail.regions.map((r) => r.name),
      detail.move_learn_methods.map((m) => m.name)
    );
  }
}
