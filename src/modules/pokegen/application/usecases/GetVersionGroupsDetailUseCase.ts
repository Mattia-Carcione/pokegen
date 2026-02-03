import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { VersionGroupInfo } from "@/modules/pokegen/domain/entities/VersionGroupInfo";
import { IGetVersionGroupsDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetVersionGroupsDetailUseCase";
import { IVersionGroupDetailRepository } from "@/modules/pokegen/domain/repositories/IVersionGroupDetailRepository";

/**
 * Use case per recuperare la lista dettagliata dei version-group.
 */
export class GetVersionGroupsDetailUseCase implements IGetVersionGroupsDetailUseCase {
  constructor(
    private readonly versionGroupDetailRepository: IVersionGroupDetailRepository,
    private readonly logger: ILogger
  ) {}

  async execute(): Promise<Result<VersionGroupInfo[], Error>> {
    this.logger.debug("[GetVersionGroupsDetailUseCase] - Esecuzione del use case per ottenere la lista version-group");

    try {
      const data = await this.versionGroupDetailRepository.getAllAsync();
      return new Result<VersionGroupInfo[], Error>(true, data, null);
    } catch (error) {
      return new Result<VersionGroupInfo[], Error>(false, null, error as Error);
    }
  }
}
