import { defineStore } from "pinia";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { IGetPokemonTypesDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonTypesDetailUseCase";

/**
 * Store Pinia per gestire lo stato della lista dei tipi Pokémon.
 */
export const usePokemonTypesStore = defineStore("pokemonTypes", {
  state: () => ({
    list: null as TypeDto[] | null,
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    /**
     * Fetch iniziale della lista completa dei tipi.
     */
    async load(useCase: IGetPokemonTypesDetailUseCase): Promise<void> {
      const result = await useCase.execute();
      if (result.success) this.list = result.data ?? [];
      else {
        this.error = result.error ?? new Error("Errore sconosciuto");
        this.list = null;
      }

      this.loading = false;
    },

    /**
     * Imposta lo stato iniziale dello store.
     */
    init(): void {
      this.list = null;
      this.loading = false;
      this.error = null;
    },

    /** Imposta lo stato di caricamento */
    initLoading() {
      this.loading = true;
      this.error = null;
    }
  },
});
