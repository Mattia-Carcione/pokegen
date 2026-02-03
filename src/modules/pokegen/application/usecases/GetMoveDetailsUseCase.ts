import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";
import { IGetMoveDetailsUseCase } from "@/modules/pokegen/domain/usecases/IGetMoveDetailsUseCase";
import { IMoveRepository } from "@/modules/pokegen/domain/repositories/IMoveRepository";
import { safeFetch } from "@/core/utils/async/SafeFetch";
import { IMoveDetailsEnricherService } from "@/modules/pokegen/application/services/contracts/IMoveDetailsEnricherService";

export interface MoveDetailsInput {
  names: string[];
  versionGroups?: string[];
}

/**
 * Use case per recuperare i dettagli delle mosse.
 */
export class GetMoveDetailsUseCase implements IGetMoveDetailsUseCase {
  constructor(
    private readonly moveRepository: IMoveRepository,
    private readonly moveDetailsEnricher: IMoveDetailsEnricherService,
    private readonly logger: ILogger
  ) {}

  async execute(input?: MoveDetailsInput): Promise<Result<MoveDetail[], Error>> {
    const names = input?.names ?? [];
    const versionGroups = input?.versionGroups ?? [];

    this.logger.debug("[GetMoveDetailsUseCase] - Fetching move details for " + names.length + " moves.");

    try {
      const uniqueNames = Array.from(new Set(names)).filter(Boolean);
      const moveResults = await Promise.all(
        uniqueNames.map((name) => safeFetch<MoveDetail>(this.moveRepository.getAsync.bind(this.moveRepository), name))
      );

      const moves = moveResults.filter((m): m is MoveDetail => Boolean(m));

      if (!versionGroups.length) {
        return new Result<MoveDetail[], Error>(true, moves, null);
      }
      const enriched = await this.moveDetailsEnricher.enrich(moves, versionGroups);
      return new Result<MoveDetail[], Error>(true, enriched, null);
    } catch (error) {
      return new Result<MoveDetail[], Error>(false, null, error as Error);
    }
  }
}
