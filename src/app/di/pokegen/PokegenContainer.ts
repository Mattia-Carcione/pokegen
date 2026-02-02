import { EnvironmentEnum } from "@/core/enums/EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { PokemonViewMapper } from "@/modules/pokegen/presentation/mappers/PokemonViewMapper";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { useGenerationStore } from "@/modules/pokegen/presentation/store/UseGenerationStore";
import { usePokegenStore } from "@/modules/pokegen/presentation/store/UsePokegenStore";
import { NavBarMapper } from "@/modules/pokegen/presentation/mappers/NavbarMapper";
import { IGenerationRepository } from "@/modules/pokegen/domain/repositories/IGenerationRepository";
import { IPokemonRepository } from "@/modules/pokegen/domain/repositories/IPokemonRepository";
import { IGetGenerationUseCase } from "@/modules/pokegen/domain/usecases/IGetGenerationUseCase";
import { IGetPokemonUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonUseCase";
import { IGetPokemonDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonDetailUseCase";
import { FactoryHelper } from "@/core/utils/factories/FactoryHelper";
import { GenerationMapper } from "@/modules/pokegen/application/mappers/GenerationMapper";
import { PokemonMapper } from "@/modules/pokegen/application/mappers/PokemonMapper";
import { GenerationDataSource } from "@/modules/pokegen/data/datasources/GenerationDataSource";
import { GenerationMockDataSource } from "@/modules/pokegen/data/datasources/mock/GenerationMockDataSource";
import { GenerationDto } from "@/modules/pokegen/data/models/dtos/GenerationDto";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { PokemonDto } from "@/modules/pokegen/data/models/dtos/PokemonDto";
import { PokemonDataSource } from "@/modules/pokegen/data/datasources/PokemonDataSource";
import { PokemonMockDataSource } from "@/modules/pokegen/data/datasources/mock/PokemonMockDataSource";
import { PokemonSpeciesDto } from "@/modules/pokegen/data/models/dtos/PokemonSpeciesDto";
import { PokemonSpeciesDataSource } from "@/modules/pokegen/data/datasources/PokemonSpeciesDataSources";
import { PokeApiResponseDto } from "@/shared/data/models/dtos/PokeApiResponseDto";
import { PokeApiResponseMockDataSource } from "@/shared/data/datasources/mock/PokeApiResponseMockDataSource";
import { GenerationRepository } from "@/modules/pokegen/data/repositories/GenerationRepository";
import { PokemonRepository } from "@/modules/pokegen/data/repositories/PokemonRepository";
import { GetGenerationUseCase } from "@/modules/pokegen/application/usecases/GetGenerationUseCase";
import { GetPokemonUseCase } from "@/modules/pokegen/application/usecases/GetPokemonUseCase";
import { GetPokemonDetailUseCase } from "@/modules/pokegen/application/usecases/GetPokemonDetailUseCase";
import { UseGenerationController } from "@/modules/pokegen/presentation/controllers/UseGenerationController";
import { UsePokemonController } from "@/modules/pokegen/presentation/controllers/UsePokemonController";
import { PokemonSpeciesMockDataSource } from "@/modules/pokegen/data/datasources/mock/PokemonSpeciesMockDataSource";
import { EvolutionChainDto } from "@/modules/pokegen/data/models/dtos/EvolutionChainDto";
import { EvolutionChainDataSource } from "@/modules/pokegen/data/datasources/EvolutionChainDataSource";
import { INavigationPokemonLoaderService } from "@/modules/pokegen/application/services/contracts/INavigationPokemonLoaderService";
import { NavigationPokemonLoaderService } from "@/modules/pokegen/application/services/NavigationPokemonLoaderService";
import { EvolutionSpriteEnricherService } from "@/modules/pokegen/application/services/EvolutionSpriteEnricherService";
import { PokeApiRepository } from "@/shared/data/repositories/PokeApiRepository";
import { IGetPokeApiUseCase } from "@/shared/domain/usecases/IGetPokeApiUseCase";
import { GetPokeApiUseCase } from "@/shared/application/usecases/GetPokeApiUseCase";
import { UsePokeApiController } from "@/modules/pokegen/presentation/controllers/UsePokeApiController";
import { usePokeApiStore } from "@/modules/pokegen/presentation/store/UsePokeApiStore";
import { IUsePokeApiController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokeApiController";
import { PokeApiResponseDataSource } from "@/shared/data/datasources/PokeApiResponseDataSource";
import { IUseGenerationController } from "@/modules/pokegen/presentation/controllers/contracts/IUseGenerationController";
import { IUsePokemonController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokemonController";
import { IGetSearchPokemonUseCase } from "@/modules/pokegen/domain/usecases/IGetSearchPokemonUseCase";
import { GetSearchPokemonUseCase } from "@/modules/pokegen/application/usecases/GetSearchPokemonUseCase";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { VarietySpriteEnricherService } from "@/modules/pokegen/application/services/VarietySpriteEnricherService";
import { ISpriteEnricherService } from "@/modules/pokegen/application/services/contracts/ISpriteEnricherService";
import { IPokemonSpriteProvider } from "@/modules/pokegen/application/providers/contracts/IPokemonSpriteProvider";
import { PokemonSpriteProvider } from "@/modules/pokegen/application/providers/PokemonSpriteProvider";
import { CompositeSpriteEnricherServiceFacade } from "@/modules/pokegen/application/services/facade/CompositeSpriteEnricherServiceFacade";

/**
 * Classe statica per la creazione dei controller della feature pokegen.
 * 
 * Espone il metodo build per creare l'istanza dei controller.
 */
export class PokegenContainer {
    private constructor() {}

    /**
     * Metodo per l'inizializzazione dei controller della feature pokegen.
     * @param env (EnvironmentEnum) - il tipo di ambiente.
     * @param deps [{ httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }] - Dipendenze dei datasource richiesti.
     * @returns Ritorna un oggetto con le istanze dei controller.
     */
    static build(env: EnvironmentEnum, deps: {
        httpClient: IHttpClient;
        httpMapper: IHttpErrorMapper;
        cache: ICache<any>;
        logger: ILogger;
    }): {
        generationController: () => IUseGenerationController;
        pokemonController: () => IUsePokemonController;
        pokeApiController: () => IUsePokeApiController;
    } {
        // --- MAPPERS ---
        const generationMapper = FactoryHelper.create<GenerationMapper>(GenerationMapper, deps.logger);

        const pokemonMapper = FactoryHelper.create<PokemonMapper>(PokemonMapper, deps.logger);

        const pokemonViewMapper = FactoryHelper.create<PokemonViewMapper>(PokemonViewMapper, deps.logger);
        
        const navbarMapper = FactoryHelper.create<NavBarMapper>(NavBarMapper, deps.logger);
        
        // --- DATA SOURCES ---
        const dataSourceFactoryInput = [deps.httpClient, deps.httpMapper, deps.logger];
        const generationDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<GenerationDto>>(env, GenerationDataSource, GenerationMockDataSource, ...dataSourceFactoryInput);

        const pokemonDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<PokemonDto>>(env, PokemonDataSource, PokemonMockDataSource, ...dataSourceFactoryInput);

        const pokemonSpeciesDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<PokemonSpeciesDto>>(env, PokemonSpeciesDataSource, PokemonSpeciesMockDataSource, ...dataSourceFactoryInput);

        const evolutionChainDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<EvolutionChainDto>>(env, EvolutionChainDataSource, EvolutionChainDataSource, ...dataSourceFactoryInput);

        const pokeApiResponseDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<PokeApiResponseDto>>(env, PokeApiResponseDataSource, PokeApiResponseMockDataSource, ...dataSourceFactoryInput);

        // --- REPOSITORIES ---
        const generationRepository = FactoryHelper
            .create<IGenerationRepository>(GenerationRepository, generationDataSource, pokeApiResponseDataSource, pokemonDataSource, generationMapper, pokemonMapper, deps.cache, deps.logger);

        const pokemonRepository = FactoryHelper
            .create<IPokemonRepository>(PokemonRepository, pokemonDataSource, pokemonSpeciesDataSource, evolutionChainDataSource, pokemonMapper, deps.cache, deps.logger);

        const pokeapiRepository = FactoryHelper
            .create<PokeApiRepository>(PokeApiRepository, pokeApiResponseDataSource, deps.cache, deps.logger);

        // --- PROVIDERS ---
        const pokemonSpriteProvider = FactoryHelper
            .create<IPokemonSpriteProvider>(PokemonSpriteProvider, pokemonRepository, deps.logger);

        // --- SERVICES ---
        const navigationPokemonLoaderService = FactoryHelper
            .create<INavigationPokemonLoaderService>(NavigationPokemonLoaderService, pokemonRepository, deps.logger);

        const evolutionSpriteEnricherService = FactoryHelper
            .create<ISpriteEnricherService>(EvolutionSpriteEnricherService, pokemonRepository, deps.logger);

        const varietySpriteEnricherService = FactoryHelper
            .create<ISpriteEnricherService>(VarietySpriteEnricherService, pokemonSpriteProvider, deps.logger);

        const pokemonSpriteEnricherService = FactoryHelper
            .create<ISpriteEnricherService>(CompositeSpriteEnricherServiceFacade, [evolutionSpriteEnricherService, varietySpriteEnricherService], deps.logger);

        // --- USE CASES ---
        const generationUseCase = FactoryHelper
            .create<IGetGenerationUseCase>(GetGenerationUseCase, generationRepository, deps.logger);

        const pokemonUseCase = FactoryHelper
            .create<IGetPokemonUseCase>(GetPokemonUseCase, generationRepository, deps.logger);

        const pokemonDetailUseCase = FactoryHelper
            .create<IGetPokemonDetailUseCase>(GetPokemonDetailUseCase, pokemonRepository, navigationPokemonLoaderService, pokemonSpriteEnricherService, deps.logger);

        const pokeapiUseCase = FactoryHelper
            .create<IGetPokeApiUseCase>(GetPokeApiUseCase, pokeapiRepository, deps.logger);

        const searchPokemonUseCase = FactoryHelper
            .create<IGetSearchPokemonUseCase>(GetSearchPokemonUseCase, pokemonRepository, deps.logger);

        // --- CONTROLLERS ---
        const genController = () => FactoryHelper
            .create<UseGenerationController>(UseGenerationController, useGenerationStore(), generationUseCase, navbarMapper, deps.logger);
        
        const pkmController = () => FactoryHelper
            .create<UsePokemonController>(UsePokemonController, usePokegenStore(), usePokeApiStore(), pokemonUseCase, pokemonDetailUseCase, searchPokemonUseCase, pokemonViewMapper, deps.logger);
        
        const pkApiController = () => FactoryHelper
            .create<UsePokeApiController>(UsePokeApiController, usePokeApiStore(), pokeapiUseCase, deps.logger);
        
            return {
            generationController: genController,
            pokemonController: pkmController,
            pokeApiController: pkApiController,
        }
    }
}
