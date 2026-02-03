import { computed, ComputedRef, shallowRef, watch } from "vue";
import { PokegenStore } from "../store/types/StoreTypes";
import { IGetPokemonUseCase } from "../../domain/usecases/IGetPokemonUseCase";
import { IGetPokemonDetailUseCase } from "../../domain/usecases/IGetPokemonDetailUseCase";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IPokemonViewMapper } from "../mappers/contracts/IPokemonViewMapper";
import { HomeViewModel } from "../viewmodels/HomeViewModel";
import { DetailViewModel } from "../viewmodels/DetailViewModel";
import { TypeRequestEnum } from "../enums/TypeRequestEnum";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IUsePokemonController } from "./contracts/IUsePokemonController";
import { PokeApiStore, PokemonTypesStore } from "@/modules/pokegen/presentation/store/types/StoreTypes";
import { IGetSearchPokemonUseCase } from "../../domain/usecases/IGetSearchPokemonUseCase";
import { IGetPokemonByTypeUseCase } from "../../domain/usecases/IGetPokemonByTypeUseCase";
import { ITypeEffectivenessService } from "@/modules/pokegen/application/services/contracts/ITypeEffectivenessService";
import { TypeEffectivenessVM } from "@/modules/pokegen/presentation/viewmodels/types/TypeEffectivenessVM";
import { ITypeEffectivenessViewMapper } from "@/modules/pokegen/presentation/mappers/contracts/ITypeEffectivenessViewMapper";

/**
 * Implementazione del controller della generazione dei Pokémon.
 */
export class UsePokemonController extends IUsePokemonController {
    private homeVM = shallowRef<HomeViewModel | null>(null);
    private detailVM = shallowRef<DetailViewModel | null>(null);

    /**
     * Costruttore del controller.
     * @param store Lo store della generazione dei Pokémon.
     * @param useCase Il caso d'uso per ottenere i dati della generazione dei Pokémon.
     * @param detailUseCase Il caso d'uso per ottenere i dettagli di un Pokémon specifico.
     * @param mapper Il mapper per convertire i dati del Pokémon in ViewModel.
     * @param logger Il logger per la registrazione delle operazioni.
     */
    constructor(
        private readonly store: PokegenStore,
        private readonly pokeApiStore: PokeApiStore,
        private readonly useCase: IGetPokemonUseCase,
        private readonly detailUseCase: IGetPokemonDetailUseCase,
        private readonly pokeSearchUseCase: IGetSearchPokemonUseCase,
        private readonly pokemonTypesStore: PokemonTypesStore,
        private readonly pokemonByTypeUseCase: IGetPokemonByTypeUseCase,
        private readonly typeEffectivenessService: ITypeEffectivenessService,
        private readonly typeEffectivenessMapper: ITypeEffectivenessViewMapper,
        private readonly mapper: IPokemonViewMapper,
        private readonly logger: ILogger
    ) {
        super();

        watch(() => [this.store.pokemon, this.store.typeRequest], ([data, req]) => {
            if (!data || !req) return;
            switch (req) {
                case TypeRequestEnum.HOME:
                case TypeRequestEnum.SEARCH:
                    const homeResponse = data as Pokemon[];
                    this.buildHomeViewModel(homeResponse);
                    break;
                case TypeRequestEnum.DETAIL:
                    const detailResponse = data as Pokemon[];
                    this.buildDetailViewModel(detailResponse);
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Recupera i dati della generazione dei Pokémon dallo store.
     */
    get data(): ComputedRef<[] | HomeViewModel | DetailViewModel> {
        return computed(() => {
            switch (this.store.typeRequest) {
                case TypeRequestEnum.HOME:
                case TypeRequestEnum.SEARCH:
                    return this.homeVM.value ?? [];
                case TypeRequestEnum.DETAIL:
                    return this.detailVM.value ?? [];
                default:
                    return [];
            }
        });
    }

    /**
     * Indica se i dati della generazione sono in fase di caricamento.
     */
    get isLoading(): ComputedRef<boolean> {
        return computed(() => {
            return this.store.loading;
        });
    }

    /**
     * Recupera l'errore dallo store, se presente.
     */
    get error(): ComputedRef<Error | null> {
        return computed(() => this.store.error);
    }

    /**
     * Gestisce la richiesta di generazione dei Pokémon.
     * @param input Input contenente l'endpoint e il tipo di richiesta.
     * @returns Una Promise che si risolve quando i dati sono stati caricati.
     */
    async loadData(input: { endpoint: string, req: TypeRequestEnum }): Promise<void> {
        this.store.setInit(input);
        if (input.req === TypeRequestEnum.DETAIL)
            await this.store.ensureLoaded(this.detailUseCase, input);
        else
            await this.store.ensureLoaded(this.useCase, input);

        this.logger.info("[UsePokemonController] - Dati dei Pokémon caricati con successo.");
    }

    /**
     * Esegue una ricerca locale tra i Pokémon per nome.
     * @param prefix Il prefisso da cercare.
     * @returns Una lista di risorse nominate che corrispondono al prefisso.
     */
    async searching(input: { endpoint: string, req: TypeRequestEnum }): Promise<void> {
        this.store.setInit(input);
        this.store.pokemon = [];
        const value = input.endpoint.trim().toLowerCase();

        const typeList = this.pokemonTypesStore.list;
        const isTypeSearch = !!typeList?.some((t) => t.name.toLowerCase() === value);

        if (isTypeSearch) {
            const result = await this.pokemonByTypeUseCase.execute(value);
            if (!result.success || !result.data || result.data.length === 0) {
                this.store.loading = false;
                this.store.error = result.error ?? new Error(`No Pokémon found for the given type: ${value}.`);
                return;
            }

            this.store.pokemon = result.data;
            this.store.loading = false;
            return;
        }

        await this.pokeApiStore.search(value, this.pokeSearchUseCase);

        const data = this.pokeApiStore.data;
        if (!data || data.length === 0) {
            this.store.loading = false;
            this.store.error = new Error(`No Pokémon found for the given search criteria: ${input.endpoint}.`);
            return;
        }

        this.store.pokemon = data;
        this.store.loading = false;
    }

    /** 
     * Costruisce il ViewModel per la vista principale. 
     * @param data I dati dei Pokémon da mappare.
    */
    private buildHomeViewModel(data: Pokemon[]): void {
        this.homeVM.value = new HomeViewModel(data.map(p => this.mapper.map(p)));
    }

    /** 
     * Costruisce il ViewModel per la vista dei dettagli. 
     * @param data I dati dei Pokémon da mappare.
    */
    private async buildDetailViewModel(data: Pokemon[]): Promise<void> {
        const name = this.store.input?.toLowerCase() || '';
        const main = data.find(p => p.nameSpecies.toLowerCase() === name);

        if (!main) return;
        const index = data.indexOf(main);
        const prev = data[index - 1] ?? null;
        const next = data[index + 1] ?? null;

        const typeEffectiveness = await this.mapTypeEffectiveness(main);

        this.detailVM.value = new DetailViewModel(
            this.mapper.mapDetail(main),
            prev ? this.mapper.map(prev) : null,
            next ? this.mapper.map(next) : null,
            typeEffectiveness
        );
    }

    private async mapTypeEffectiveness(pokemon: Pokemon): Promise<TypeEffectivenessVM | null> {
        try {
            const types = pokemon.types.map((t) => t.name);
            const effectiveness = await this.typeEffectivenessService.getEffectiveness(types);

            return this.typeEffectivenessMapper.map(effectiveness);
        } catch (error) {
            this.logger.error("[UsePokemonController] - Error computing type effectiveness." + (error as Error).message);
            return null;
        }
    }
}
