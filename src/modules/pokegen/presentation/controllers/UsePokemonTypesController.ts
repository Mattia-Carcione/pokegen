import { computed, ComputedRef } from "vue";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { IGetPokemonTypesDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonTypesDetailUseCase";
import { PokemonTypesStore } from "@/modules/pokegen/presentation/store/types/StoreTypes";
import { IUsePokemonTypesController } from "./contracts/IUsePokemonTypesController";

/**
 * Controller per la lista dei tipi Pokémon.
 */
export class UsePokemonTypesController implements IUsePokemonTypesController {
  constructor(
    private readonly store: PokemonTypesStore,
    private readonly getTypesUseCase: IGetPokemonTypesDetailUseCase,
    private readonly logger: ILogger,
  ) { }

  /** Inizializza lo store caricando la lista dei tipi se non già presente */
  async loadData(): Promise<void> {
    if (this.store.list) return;
    this.store.init();
    this.logger.info("[UsePokemonTypesController] - Init pokemon types list");
    await this.store.load(this.getTypesUseCase);
  }

  /** Getter per la lista dei tipi */
  get list(): ComputedRef<TypeDto[] | null> {
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
