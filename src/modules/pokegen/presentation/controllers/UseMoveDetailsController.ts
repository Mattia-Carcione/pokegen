import { computed, ComputedRef } from "vue";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";
import { IGetMoveDetailsUseCase } from "@/modules/pokegen/domain/usecases/IGetMoveDetailsUseCase";
import { MoveDetailsStore } from "@/modules/pokegen/presentation/store/types/StoreTypes";
import { IUseMoveDetailsController } from "@/modules/pokegen/presentation/controllers/contracts/IUseMoveDetailsController";

/**
 * Controller per i dettagli delle mosse.
 */
export class UseMoveDetailsController implements IUseMoveDetailsController {
  constructor(
    private readonly store: MoveDetailsStore,
    private readonly getMoveDetailsUseCase: IGetMoveDetailsUseCase,
    private readonly logger: ILogger,
  ) {}

  async loadData(input: { names: string[]; versionGroups?: string[] }): Promise<void> {
    if (!input.names?.length) return;
    this.store.initLoading();
    this.logger.info("[UseMoveDetailsController] - Fetching move details");
    await this.store.load(this.getMoveDetailsUseCase, input);
  }

  get details(): ComputedRef<Record<string, MoveDetail>> {
    return computed(() => this.store.details);
  }

  get isLoading(): ComputedRef<boolean> {
    return computed(() => this.store.loading);
  }

  get error(): ComputedRef<Error | null> {
    return computed(() => this.store.error);
  }
}
