import { computed, ComputedRef } from "vue";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { VersionGroupInfo } from "@/modules/pokegen/domain/entities/VersionGroupInfo";
import { IGetVersionGroupsDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetVersionGroupsDetailUseCase";
import { VersionGroupsStore } from "@/modules/pokegen/presentation/store/types/StoreTypes";
import { IUseVersionGroupsController } from "@/modules/pokegen/presentation/controllers/contracts/IUseVersionGroupsController";

/**
 * Controller per la lista dei version-group.
 */
export class UseVersionGroupsController implements IUseVersionGroupsController {
  constructor(
    private readonly store: VersionGroupsStore,
    private readonly getVersionGroupsUseCase: IGetVersionGroupsDetailUseCase,
    private readonly logger: ILogger,
  ) {}

  /** Inizializza lo store caricando la lista se non già presente */
  async loadData(): Promise<void> {
    if (this.store.list) return;
    this.store.init();
    this.logger.info("[UseVersionGroupsController] - Init version-group list");
    await this.store.load(this.getVersionGroupsUseCase);
  }

  /** Getter per la lista dei version-group */
  get list(): ComputedRef<VersionGroupInfo[] | null> {
    return computed(() => this.store.list);
  }

  /** Getter per lo stato di caricamento */
  get isLoading(): ComputedRef<boolean> {
    return computed(() => this.store.loading);
  }

  /** Getter per l'eventuale errore */
  get error(): ComputedRef<Error | null> {
    return computed(() => this.store.error);
  }
}
