import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MoveDto } from "@/modules/pokegen/data/models/dtos/MoveDto";
import { IMoveRepository } from "@/modules/pokegen/domain/repositories/IMoveRepository";
import { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";
import { NotImplementedError } from "@/core/errors/NotImplementedError";

/**
 * Repository per i dettagli delle mosse.
 */
export class MoveRepository implements IMoveRepository {
  protected readonly className = "MoveRepository";

  constructor(
    private readonly moveDataSource: IDataSource<MoveDto>,
    private readonly cache: ICache<MoveDetail | MoveDetail[]>,
    private readonly logger: ILogger
  ) {}

  async getAsync(name: string): Promise<MoveDetail> {
    this.logger.debug(`[${this.className}] - Fetching move detail: ${name}`);

    const key = this.cache.generateKey(this.className, "getAsync", name);
    const cached = this.cache.get(key);
    if (cached) {
      this.logger.debug(`[${this.className}] - Move detail found in cache: ${name}`);
      return cached as MoveDetail;
    }

    const detail = await this.moveDataSource.fetchData(name);
    const mapped = this.mapDetail(detail);
    this.cache.set(key, mapped, 1000 * 60 * 60);
    return mapped;
  }

  getAllAsync(): Promise<MoveDetail[]> {
    throw new NotImplementedError("[MoveRepository] - getAllAsync method is not implemented.");
  }

  private mapDetail(detail: MoveDto): MoveDetail {
    return new MoveDetail(
      detail.name,
      detail.type?.name ?? "normal",
      detail.damage_class?.name ?? "status",
      detail.power ?? null,
      detail.accuracy ?? null,
      detail.pp ?? null,
      (detail.machines ?? [])
        .map((machine) => ({
          versionGroup: machine.version_group?.name ?? "",
          machineUrl: machine.machine?.url ?? "",
        }))
        .filter((item) => item.versionGroup && item.machineUrl)
    );
  }
}
