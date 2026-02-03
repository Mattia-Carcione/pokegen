import { defineStore } from "pinia";
import { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";
import { IGetMoveDetailsUseCase } from "@/modules/pokegen/domain/usecases/IGetMoveDetailsUseCase";

/**
 * Store Pinia per gestire lo stato dei dettagli delle mosse.
 */
export const useMoveDetailsStore = defineStore("moveDetails", {
  state: () => ({
    details: {} as Record<string, MoveDetail>,
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    async load(
      useCase: IGetMoveDetailsUseCase,
      input: { names: string[]; versionGroups?: string[] }
    ): Promise<void> {
      const unique = Array.from(new Set(input.names)).filter(Boolean);
      const versionGroups = input.versionGroups ?? [];
      const pending = unique.filter((name) => {
        const existing = this.details[name];
        if (!existing) return true;
        if (!versionGroups.length) return false;
        return versionGroups.some((group) => !existing.machineNumbers?.[group]);
      });

      if (!pending.length) {
        this.loading = false;
        return;
      }

      const result = await useCase.execute({ names: pending, versionGroups });
      if (result.success && result.data) {
        result.data.forEach((detail) => {
          const existing = this.details[detail.name];
          if (!existing) {
            this.details[detail.name] = detail;
            return;
          }

          if (!detail.machineNumbers) {
            this.details[detail.name] = existing;
            return;
          }

          const mergedNumbers = {
            ...(existing.machineNumbers ?? {}),
            ...detail.machineNumbers,
          };

          this.details[detail.name] = new MoveDetail(
            existing.name,
            existing.type,
            existing.damageClass,
            existing.power,
            existing.accuracy,
            existing.pp,
            existing.machines,
            mergedNumbers
          );
        });
      } else {
        this.error = result.error ?? new Error("Errore sconosciuto");
      }

      this.loading = false;
    },

    init(): void {
      this.details = {};
      this.loading = false;
      this.error = null;
    },

    initLoading(): void {
      this.loading = true;
      this.error = null;
    }
  }
});
