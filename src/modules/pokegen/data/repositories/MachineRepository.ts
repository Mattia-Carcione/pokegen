import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MachineDto } from "@/modules/pokegen/data/models/dtos/MachineDto";
import { IMachineRepository } from "@/modules/pokegen/domain/repositories/IMachineRepository";
import { MachineInfo } from "@/modules/pokegen/domain/entities/MachineInfo";
import { NotImplementedError } from "@/core/errors/NotImplementedError";

/**
 * Repository per i dettagli delle macchine.
 */
export class MachineRepository implements IMachineRepository {
  protected readonly className = "MachineRepository";

  constructor(
    private readonly machineDataSource: IDataSource<MachineDto>,
    private readonly cache: ICache<MachineInfo | MachineInfo[]>,
    private readonly logger: ILogger
  ) {}

  async getAsync(url: string): Promise<MachineInfo> {
    this.logger.debug(`[${this.className}] - Fetching machine detail: ${url}`);

    const key = this.cache.generateKey(this.className, "getAsync", url);
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Machine detail found in cache: ${url}`);
      return cached as MachineInfo;
    }

    const detail = await this.machineDataSource.fetchData(url);
    const mapped = this.mapDetail(detail, url);
    this.cache.set(key, mapped, 1000 * 60 * 60);
    return mapped;
  }

  getAllAsync(): Promise<MachineInfo[]> {
    throw new NotImplementedError("[MachineRepository] - getAllAsync method is not implemented.");
  }

  private mapDetail(detail: MachineDto, url: string): MachineInfo {
    const itemName = detail.item?.name ?? "";
    const match = itemName.match(/^(tm|hm)(\d+)/i);
    const machineNumber = match
      ? `${match[1].toUpperCase()}${match[2].padStart(2, "0")}`
      : null;

    return new MachineInfo(url, itemName, machineNumber);
  }
}
