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
import { TypeResponseMockDataSource } from "@/shared/data/datasources/mock/TypeResponseMockDataSource";
import { TypeDataSource } from "@/modules/pokegen/data/datasources/TypeDataSource";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { TypeMockDataSource } from "@/modules/pokegen/data/datasources/mock/TypeMockDataSource";
import { GenerationRepository } from "@/modules/pokegen/data/repositories/GenerationRepository";
import { PokemonRepository } from "@/modules/pokegen/data/repositories/PokemonRepository";
import { TypeRepository } from "@/modules/pokegen/data/repositories/TypeRepository";
import { TypePokemonRepository } from "@/modules/pokegen/data/repositories/TypePokemonRepository";
import { TypeDetailRepository } from "@/modules/pokegen/data/repositories/TypeDetailRepository";
import { VersionGroupRepository } from "@/modules/pokegen/data/repositories/VersionGroupRepository";
import { VersionGroupDetailRepository } from "@/modules/pokegen/data/repositories/VersionGroupDetailRepository";
import { MoveRepository } from "@/modules/pokegen/data/repositories/MoveRepository";
import { MachineRepository } from "@/modules/pokegen/data/repositories/MachineRepository";
import { GetGenerationUseCase } from "@/modules/pokegen/application/usecases/GetGenerationUseCase";
import { GetPokemonUseCase } from "@/modules/pokegen/application/usecases/GetPokemonUseCase";
import { GetPokemonDetailUseCase } from "@/modules/pokegen/application/usecases/GetPokemonDetailUseCase";
import { GetPokemonTypesDetailUseCase } from "@/modules/pokegen/application/usecases/GetPokemonTypesDetailUseCase";
import { GetPokemonByTypeUseCase } from "@/modules/pokegen/application/usecases/GetPokemonByTypeUseCase";
import { GetVersionGroupsDetailUseCase } from "@/modules/pokegen/application/usecases/GetVersionGroupsDetailUseCase";
import { GetMoveDetailsUseCase } from "@/modules/pokegen/application/usecases/GetMoveDetailsUseCase";
import { UseGenerationController } from "@/modules/pokegen/presentation/controllers/UseGenerationController";
import { UsePokemonController } from "@/modules/pokegen/presentation/controllers/UsePokemonController";
import { UsePokemonTypesController } from "@/modules/pokegen/presentation/controllers/UsePokemonTypesController";
import { UseVersionGroupsController } from "@/modules/pokegen/presentation/controllers/UseVersionGroupsController";
import { UseMoveDetailsController } from "@/modules/pokegen/presentation/controllers/UseMoveDetailsController";
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
import { IUsePokemonTypesController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokemonTypesController";
import { IGetSearchPokemonUseCase } from "@/modules/pokegen/domain/usecases/IGetSearchPokemonUseCase";
import { GetSearchPokemonUseCase } from "@/modules/pokegen/application/usecases/GetSearchPokemonUseCase";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { VarietySpriteEnricherService } from "@/modules/pokegen/application/services/VarietySpriteEnricherService";
import { ISpriteEnricherService } from "@/modules/pokegen/application/services/contracts/ISpriteEnricherService";
import { IPokemonSpriteProvider } from "@/modules/pokegen/application/providers/contracts/IPokemonSpriteProvider";
import { PokemonSpriteProvider } from "@/modules/pokegen/application/providers/PokemonSpriteProvider";
import { CompositeSpriteEnricherServiceFacade } from "@/modules/pokegen/application/services/facade/CompositeSpriteEnricherServiceFacade";
import { usePokemonTypesStore } from "@/modules/pokegen/presentation/store/UsePokemonTypesStore";
import { useVersionGroupsStore } from "@/modules/pokegen/presentation/store/UseVersionGroupsStore";
import { useMoveDetailsStore } from "@/modules/pokegen/presentation/store/UseMoveDetailsStore";
import { ITypeRepository } from "@/modules/pokegen/domain/repositories/ITypeRepository";
import { ITypeDetailRepository } from "@/modules/pokegen/domain/repositories/ITypeDetailRepository";
import { IGetPokemonTypesDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonTypesDetailUseCase";
import { ITypePokemonRepository } from "@/modules/pokegen/domain/repositories/ITypePokemonRepository";
import { IGetPokemonByTypeUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonByTypeUseCase";
import { IVersionGroupRepository } from "@/modules/pokegen/domain/repositories/IVersionGroupRepository";
import { IVersionGroupDetailRepository } from "@/modules/pokegen/domain/repositories/IVersionGroupDetailRepository";
import { IGetVersionGroupsDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetVersionGroupsDetailUseCase";
import { IMoveRepository } from "@/modules/pokegen/domain/repositories/IMoveRepository";
import { IMachineRepository } from "@/modules/pokegen/domain/repositories/IMachineRepository";
import { IGetMoveDetailsUseCase } from "@/modules/pokegen/domain/usecases/IGetMoveDetailsUseCase";
import { ITypeEffectivenessService } from "@/modules/pokegen/application/services/contracts/ITypeEffectivenessService";
import { TypeEffectivenessService } from "@/modules/pokegen/application/services/TypeEffectivenessService";
import { ITypeEffectivenessCalculator } from "@/modules/pokegen/application/services/contracts/ITypeEffectivenessCalculator";
import { TypeEffectivenessCalculator } from "@/modules/pokegen/application/services/TypeEffectivenessCalculator";
import type { IMoveDetailsEnricherService } from "@/modules/pokegen/application/services/contracts/IMoveDetailsEnricherService";
import { MoveDetailsEnricherService } from "@/modules/pokegen/application/services/MoveDetailsEnricherService";
import { ITypeEffectivenessViewMapper } from "@/modules/pokegen/presentation/mappers/contracts/ITypeEffectivenessViewMapper";
import { TypeEffectivenessViewMapper } from "@/modules/pokegen/presentation/mappers/TypeEffectivenessViewMapper";
import { VersionGroupDataSource } from "@/modules/pokegen/data/datasources/VersionGroupDataSource";
import { VersionGroupMockDataSource } from "@/modules/pokegen/data/datasources/mock/VersionGroupMockDataSource";
import { VersionGroupDto } from "@/modules/pokegen/data/models/dtos/VersionGroupDto";
import { IUseVersionGroupsController } from "@/modules/pokegen/presentation/controllers/contracts/IUseVersionGroupsController";
import { MoveDataSource } from "@/modules/pokegen/data/datasources/MoveDataSource";
import { MachineDataSource } from "@/modules/pokegen/data/datasources/MachineDataSource";
import { MoveMockDataSource } from "@/modules/pokegen/data/datasources/mock/MoveMockDataSource";
import { MachineMockDataSource } from "@/modules/pokegen/data/datasources/mock/MachineMockDataSource";
import { MoveDto } from "@/modules/pokegen/data/models/dtos/MoveDto";
import { MachineDto } from "@/modules/pokegen/data/models/dtos/MachineDto";
import { IUseMoveDetailsController } from "@/modules/pokegen/presentation/controllers/contracts/IUseMoveDetailsController";

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
        pokemonTypesController: () => IUsePokemonTypesController;
        versionGroupsController: () => IUseVersionGroupsController;
        moveDetailsController: () => IUseMoveDetailsController;
    } {
        // --- MAPPERS ---
        const generationMapper = FactoryHelper.create<GenerationMapper>(GenerationMapper, deps.logger);

        const pokemonMapper = FactoryHelper.create<PokemonMapper>(PokemonMapper, deps.logger);

        const pokemonViewMapper = FactoryHelper.create<PokemonViewMapper>(PokemonViewMapper, deps.logger);
        
        const navbarMapper = FactoryHelper.create<NavBarMapper>(NavBarMapper, deps.logger);

        const typeEffectivenessViewMapper = FactoryHelper
            .create<ITypeEffectivenessViewMapper>(TypeEffectivenessViewMapper, deps.logger);
        
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

        const typeResponseDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<PokeApiResponseDto>>(env, PokeApiResponseDataSource, TypeResponseMockDataSource, ...dataSourceFactoryInput);

        const typeDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<TypeDto>>(env, TypeDataSource, TypeMockDataSource, ...dataSourceFactoryInput);

        const versionGroupResponseDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<PokeApiResponseDto>>(env, PokeApiResponseDataSource, PokeApiResponseDataSource, ...dataSourceFactoryInput);

        const versionGroupDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<VersionGroupDto>>(env, VersionGroupDataSource, VersionGroupMockDataSource, ...dataSourceFactoryInput);

        const moveDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<MoveDto>>(env, MoveDataSource, MoveMockDataSource, ...dataSourceFactoryInput);

        const machineDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<MachineDto>>(env, MachineDataSource, MachineMockDataSource, ...dataSourceFactoryInput);

        // --- REPOSITORIES ---
        const generationRepository = FactoryHelper
            .create<IGenerationRepository>(GenerationRepository, generationDataSource, pokeApiResponseDataSource, pokemonDataSource, generationMapper, pokemonMapper, deps.cache, deps.logger);

        const pokemonRepository = FactoryHelper
            .create<IPokemonRepository>(PokemonRepository, pokemonDataSource, pokemonSpeciesDataSource, evolutionChainDataSource, pokemonMapper, deps.cache, deps.logger);

        const pokeapiRepository = FactoryHelper
            .create<PokeApiRepository>(PokeApiRepository, pokeApiResponseDataSource, deps.cache, deps.logger);

        const typeRepository = FactoryHelper
            .create<ITypeRepository>(TypeRepository, typeResponseDataSource, deps.cache, deps.logger);

        const typeDetailRepository = FactoryHelper
            .create<ITypeDetailRepository>(TypeDetailRepository, typeRepository, typeDataSource, deps.cache, deps.logger);

        const typePokemonRepository = FactoryHelper
            .create<ITypePokemonRepository>(TypePokemonRepository, typeDataSource, pokemonRepository, deps.cache, deps.logger);

        const versionGroupRepository = FactoryHelper
            .create<IVersionGroupRepository>(VersionGroupRepository, versionGroupResponseDataSource, deps.cache, deps.logger);

        const versionGroupDetailRepository = FactoryHelper
            .create<IVersionGroupDetailRepository>(VersionGroupDetailRepository, versionGroupRepository, versionGroupDataSource, deps.cache, deps.logger);

        const moveRepository = FactoryHelper
            .create<IMoveRepository>(MoveRepository, moveDataSource, deps.cache, deps.logger);

        const machineRepository = FactoryHelper
            .create<IMachineRepository>(MachineRepository, machineDataSource, deps.cache, deps.logger);

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

        const typeEffectivenessCalculator = FactoryHelper
            .create<ITypeEffectivenessCalculator>(TypeEffectivenessCalculator);

        const typeEffectivenessService = FactoryHelper
            .create<ITypeEffectivenessService>(TypeEffectivenessService, typeDetailRepository, typeEffectivenessCalculator, deps.logger);

        const moveDetailsEnricherService = FactoryHelper
            .create<IMoveDetailsEnricherService>(MoveDetailsEnricherService, machineRepository, deps.logger);

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

        const pokemonTypesDetailUseCase = FactoryHelper
            .create<IGetPokemonTypesDetailUseCase>(GetPokemonTypesDetailUseCase, typeDetailRepository, deps.logger);

        const pokemonByTypeUseCase = FactoryHelper
            .create<IGetPokemonByTypeUseCase>(GetPokemonByTypeUseCase, typePokemonRepository, deps.logger);

        const versionGroupsDetailUseCase = FactoryHelper
            .create<IGetVersionGroupsDetailUseCase>(GetVersionGroupsDetailUseCase, versionGroupDetailRepository, deps.logger);

        const moveDetailsUseCase = FactoryHelper
            .create<IGetMoveDetailsUseCase>(GetMoveDetailsUseCase, moveRepository, moveDetailsEnricherService, deps.logger);

        // --- CONTROLLERS ---
        const genController = () => FactoryHelper
            .create<UseGenerationController>(UseGenerationController, useGenerationStore(), generationUseCase, navbarMapper, deps.logger);
        
        const pkmController = () => FactoryHelper
            .create<UsePokemonController>(UsePokemonController, usePokegenStore(), usePokeApiStore(), pokemonUseCase, pokemonDetailUseCase, searchPokemonUseCase, usePokemonTypesStore(), pokemonByTypeUseCase, typeEffectivenessService, typeEffectivenessViewMapper, pokemonViewMapper, deps.logger);
        
        const pkApiController = () => FactoryHelper
            .create<UsePokeApiController>(UsePokeApiController, usePokeApiStore(), pokeapiUseCase, deps.logger);

        const pokemonTypesController = () => FactoryHelper
            .create<UsePokemonTypesController>(UsePokemonTypesController, usePokemonTypesStore(), pokemonTypesDetailUseCase, deps.logger);

        const versionGroupsController = () => FactoryHelper
            .create<UseVersionGroupsController>(UseVersionGroupsController, useVersionGroupsStore(), versionGroupsDetailUseCase, deps.logger);

        const moveDetailsController = () => FactoryHelper
            .create<UseMoveDetailsController>(UseMoveDetailsController, useMoveDetailsStore(), moveDetailsUseCase, deps.logger);
        
            return {
            generationController: genController,
            pokemonController: pkmController,
            pokeApiController: pkApiController,
            pokemonTypesController: pokemonTypesController,
            versionGroupsController: versionGroupsController,
            moveDetailsController: moveDetailsController,
        }
    }
}
