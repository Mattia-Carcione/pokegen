import { Result } from "@/core/domain/entities/Result";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IGetPokemonDetailUseCase } from "../../domain/usecases/IGetPokemonDetailUseCase";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { INavigationPokemonLoaderService } from "../services/contracts/INavigationPokemonLoaderService";
import { ISpriteEnricherService } from "../services/contracts/ISpriteEnricherService";

/**
 * Use case per recuperare i dati di un Pokémon specifico.
 */
export class GetPokemonDetailUseCase implements IGetPokemonDetailUseCase {
    constructor(
        private readonly pokemonRepository: IPokemonRepository,
        private readonly navigationService: INavigationPokemonLoaderService,
        private readonly spriteEnricherService: ISpriteEnricherService,
        private readonly logger: ILogger
    ) { }

    /**
     * Esegue il use case per ottenere i dati del Pokémon.
     * @returns Una promessa che risolve i dati del Pokémon
     */
    async execute(input: string): Promise<Result<Pokemon[], Error>> {
        this.logger.debug("[GetPokemonDetailUseCase] - Esecuzione del use case per ottenere i dati del Pokémon con input: " + input);
        
        try {
            const pokemon = await this.pokemonRepository.getDetailAsync(input);
            await this.spriteEnricherService.enrich(pokemon);
            const navigation = await this.navigationService.load(pokemon);
            const pokemonArray = [pokemon, ...navigation];
            const result = pokemonArray.sort((a, b) => a.id - b.id);
            return new Result<Pokemon[], Error>(true, result, null);
        } catch (error) {
            return new Result<Pokemon[], Error>(false, null, error as Error);
        }
    }
}
