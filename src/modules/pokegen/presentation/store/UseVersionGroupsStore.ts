import { defineStore } from "pinia";
import { VersionGroupInfo } from "@/modules/pokegen/domain/entities/VersionGroupInfo";
import { IGetVersionGroupsDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetVersionGroupsDetailUseCase";

/**
 * Store Pinia per gestire lo stato della lista dei version-group.
 */
export const useVersionGroupsStore = defineStore("versionGroups", {
  state: () => ({
    list: null as VersionGroupInfo[] | null,
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    /**
     * Fetch iniziale della lista completa dei version-group.
     */
    async load(useCase: IGetVersionGroupsDetailUseCase): Promise<void> {
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
