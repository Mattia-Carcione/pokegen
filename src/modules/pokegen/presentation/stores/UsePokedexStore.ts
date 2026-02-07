import { defineStore } from "pinia";
import { Pokedex } from "../../domain/entities/Pokedex";
import { Result } from "@/core/domain/entities/Result";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";

interface PokedexState {
    items: Pokedex[];
    loading: boolean;
    error: string | null;
}

export const usePokedexStore = defineStore("pokedexStore", {
    state: (): PokedexState => ({
        items: [],
        loading: false,
        error: null,
    }),

    actions: {
        async loadAll(controller: IUseControllerBase) {
            this.loading = true;
            this.error = null;

            try {
                const result: Result<Pokedex[], Error> = await controller.loadData();
                if (result.isSuccess) {
                    this.items = result.data!;
                } else {
                    this.error = result.error!.message;
                }
            } catch (err: unknown) {
                if (err instanceof Error) this.error = err.message;
                else this.error = "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async loadById(id: string, controller: IUseControllerBase) {
            this.loading = true;
            this.error = null;

            try {
                const result: Result<Pokedex, Error> = await controller.loadData({ id });
                if (result.isSuccess) {
                    const idx = this.items.findIndex((item) => item.id.toString() === id);
                    if (idx >= 0) this.items[idx] = result.data!;
                    else this.items.push(result.data!);
                } else {
                    this.error = result.error!.message;
                }
            } catch (err: unknown) {
                if (err instanceof Error) this.error = err.message;
                else this.error = "Unknown error";
            } finally {
                this.loading = false;
            }
        },
    },
});
