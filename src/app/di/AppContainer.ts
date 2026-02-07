import { IDataSource } from "@/core/contracts/application/IDataSource";
import { EnvironmentEnum } from "@/core/environments/EnvironmentEnum";
import { Factory } from "@/core/factories/Factory";
import { InMemoryCache } from "@/infrastructure/cache/InMemoryCache";
import { HttpClientFromFactory } from "@/infrastructure/http/adapters/HttpClientFromFactory";
import { AxiosClientFactory } from "@/infrastructure/http/client/axios/AxiosClientFactory";
import { HttpErrorMapper } from "@/infrastructure/http/mappers/HttpErrorMapper";
import { CacheDb } from "@/infrastructure/indexedDb/CacheDb";
import { Logger } from "@/infrastructure/logger/Logger";
import { DataVersionService } from "@/infrastructure/sync/DataVersionService";
import { GenerationDto } from "@/modules/pokegen/application/dtos/GenerationDto";
import { PokeApiResponseDto } from "@/modules/pokegen/application/dtos/PokeApiResponseDto";
import { PokedexDto } from "@/modules/pokegen/application/dtos/PokedexDto";
import { TypeDto } from "@/modules/pokegen/application/dtos/TypeDto";
import { GenerationDataSource } from "@/modules/pokegen/persistence/datasource/GenerationDataSource";
import { PokedexDataSource } from "@/modules/pokegen/persistence/datasource/PokedexDataSource";
import { TypeDataSource } from "@/modules/pokegen/persistence/datasource/TypeDataSource";
import { GenerationMockDataSource } from "@/modules/pokegen/persistence/datasource/mock/GenerationMockDataSource";
import { PokedexMockDataSource } from "@/modules/pokegen/persistence/datasource/mock/PokedexMockDataSource";
import { TypeMockDataSource } from "@/modules/pokegen/persistence/datasource/mock/TypeMockDataSource";
import { PokeApiResponseDataSource } from "@/modules/pokegen/persistence/datasource/PokeApiResponseDataSource";
import { GenerationMapper } from "@/modules/pokegen/persistence/mappers/GenerationMapper";
import { PokedexMapper } from "@/modules/pokegen/persistence/mappers/PokedexMapper";
import { TypeMapper } from "@/modules/pokegen/persistence/mappers/TypeMapper";
import { GenerationRepository } from "@/modules/pokegen/persistence/repositories/GenerationRepository";
import { PokedexRepository } from "@/modules/pokegen/persistence/repositories/PokedexRepository";
import { TypeRepository } from "@/modules/pokegen/persistence/repositories/TypeRepository";
import { GetGenerationsUseCase } from "@/modules/pokegen/persistence/usecases/GetGenerationUseCase";
import { GetPokedexUseCase } from "@/modules/pokegen/persistence/usecases/GetPokedexUseCase";
import { GetPokedexByIdUseCase } from "@/modules/pokegen/persistence/usecases/GetPokedexByIdUseCase";
import { GetTypesUseCase } from "@/modules/pokegen/persistence/usecases/GetTypesUseCase";
import { GetTypeByIdUseCase } from "@/modules/pokegen/persistence/usecases/GetTypeByIdUseCase";
import { GenerationController } from "@/modules/pokegen/presentation/controllers/GenerationController";
import { PokedexController } from "@/modules/pokegen/presentation/controllers/PokedexController";
import { TypeController } from "@/modules/pokegen/presentation/controllers/TypeController";

export class AppContainer {
    private readonly factory: Factory;

    constructor(env: EnvironmentEnum) {
        this.factory = Factory.initialize(env);
        this.registerCore();
        this.registerInfrastructure();
        this.registerPokegen();
    }

    // ---------------- CORE ----------------

    private registerCore() {
        this.factory.register(
            "Logger",
            {
                [EnvironmentEnum.DEVELOPMENT]: Logger,
                [EnvironmentEnum.PRODUCTION]: Logger,
                [EnvironmentEnum.TESTING]: Logger,
            },
            []
        );

        this.factory.register(
            "Cache",
            {
                [EnvironmentEnum.DEVELOPMENT]: InMemoryCache,
                [EnvironmentEnum.PRODUCTION]: InMemoryCache,
                [EnvironmentEnum.TESTING]: InMemoryCache,
            },
            []
        );
    }

    // ---------------- INFRA ----------------

    private registerInfrastructure() {
        this.factory.register(
            "HttpClientFactory",
            {
                [EnvironmentEnum.DEVELOPMENT]: AxiosClientFactory,
                [EnvironmentEnum.PRODUCTION]: AxiosClientFactory,
                [EnvironmentEnum.TESTING]: AxiosClientFactory,
            },
            ["CacheDb", "Logger"]
        );
        
        this.factory.register(
            "HttpClient",
            {
                [EnvironmentEnum.DEVELOPMENT]: HttpClientFromFactory,
                [EnvironmentEnum.PRODUCTION]: HttpClientFromFactory,
                [EnvironmentEnum.TESTING]: HttpClientFromFactory,
            },
            ["HttpClientFactory"]
        );

        this.factory.register(
            "HttpErrorMapper",
            {
                [EnvironmentEnum.DEVELOPMENT]: HttpErrorMapper,
                [EnvironmentEnum.PRODUCTION]: HttpErrorMapper,
                [EnvironmentEnum.TESTING]: HttpErrorMapper,
            },
            ["Logger"]
        );

        this.factory.register(
            "CacheDb",
            {
                [EnvironmentEnum.DEVELOPMENT]: CacheDb,
                [EnvironmentEnum.PRODUCTION]: CacheDb,
                [EnvironmentEnum.TESTING]: CacheDb,
            },
            ["Logger"]
        );

        this.factory.register(
            "DataVersionService",
            {
                [EnvironmentEnum.DEVELOPMENT]: DataVersionService,
                [EnvironmentEnum.PRODUCTION]: DataVersionService,
                [EnvironmentEnum.TESTING]: DataVersionService,
            },
            ["CacheDb", "Logger"]
        );
    }

    // ---------------- POKEGEN ----------------

    private registerPokegen() {
        this.factory.register<IDataSource<GenerationDto>>(
            "GenerationDataSource",
            {
                [EnvironmentEnum.DEVELOPMENT]: GenerationMockDataSource,
                [EnvironmentEnum.PRODUCTION]: GenerationDataSource,
                [EnvironmentEnum.TESTING]: GenerationDataSource,
            },
            ["HttpClient", "HttpErrorMapper", "Logger"]
        );

        this.factory.register<IDataSource<PokeApiResponseDto>>(
            "BasePokeApiDataSource",
            {
                [EnvironmentEnum.DEVELOPMENT]: PokeApiResponseDataSource,
                [EnvironmentEnum.PRODUCTION]: PokeApiResponseDataSource,
                [EnvironmentEnum.TESTING]: PokeApiResponseDataSource,
            },
            ["HttpClient", "HttpErrorMapper", "Logger"]
        );

        this.factory.register<IDataSource<PokedexDto>>(
            "PokedexDataSource",
            {
                [EnvironmentEnum.DEVELOPMENT]: PokedexMockDataSource,
                [EnvironmentEnum.PRODUCTION]: PokedexDataSource,
                [EnvironmentEnum.TESTING]: PokedexDataSource,
            },
            ["HttpClient", "HttpErrorMapper", "Logger"]
        );

        this.factory.register<IDataSource<TypeDto>>(
            "TypeDataSource",
            {
                [EnvironmentEnum.DEVELOPMENT]: TypeMockDataSource,
                [EnvironmentEnum.PRODUCTION]: TypeDataSource,
                [EnvironmentEnum.TESTING]: TypeDataSource,
            },
            ["HttpClient", "HttpErrorMapper", "Logger"]
        );

        this.factory.register(
            "GenerationMapper",
            {
                [EnvironmentEnum.DEVELOPMENT]: GenerationMapper,
                [EnvironmentEnum.PRODUCTION]: GenerationMapper,
                [EnvironmentEnum.TESTING]: GenerationMapper,
            },
            ["Logger"]
        );

        this.factory.register(
            "PokedexMapper",
            {
                [EnvironmentEnum.DEVELOPMENT]: PokedexMapper,
                [EnvironmentEnum.PRODUCTION]: PokedexMapper,
                [EnvironmentEnum.TESTING]: PokedexMapper,
            },
            ["Logger"]
        );

        this.factory.register(
            "TypeMapper",
            {
                [EnvironmentEnum.DEVELOPMENT]: TypeMapper,
                [EnvironmentEnum.PRODUCTION]: TypeMapper,
                [EnvironmentEnum.TESTING]: TypeMapper,
            },
            ["Logger"]
        );

        this.factory.register(
            "GenerationRepository",
            {
                [EnvironmentEnum.DEVELOPMENT]: GenerationRepository,
                [EnvironmentEnum.PRODUCTION]: GenerationRepository,
                [EnvironmentEnum.TESTING]: GenerationRepository,
            },
            [
                "BasePokeApiDataSource",
                "GenerationDataSource",
                "GenerationMapper",
                "Cache",
                "Logger",
            ]
        );

        this.factory.register(
            "PokedexRepository",
            {
                [EnvironmentEnum.DEVELOPMENT]: PokedexRepository,
                [EnvironmentEnum.PRODUCTION]: PokedexRepository,
                [EnvironmentEnum.TESTING]: PokedexRepository,
            },
            [
                "BasePokeApiDataSource",
                "PokedexDataSource",
                "PokedexMapper",
                "Cache",
                "Logger",
            ]
        );

        this.factory.register(
            "TypeRepository",
            {
                [EnvironmentEnum.DEVELOPMENT]: TypeRepository,
                [EnvironmentEnum.PRODUCTION]: TypeRepository,
                [EnvironmentEnum.TESTING]: TypeRepository,
            },
            [
                "BasePokeApiDataSource",
                "TypeDataSource",
                "TypeMapper",
                "Cache",
                "Logger",
            ]
        );

        this.factory.register(
            "GetGenerationsUseCase",
            {
                [EnvironmentEnum.DEVELOPMENT]: GetGenerationsUseCase,
                [EnvironmentEnum.PRODUCTION]: GetGenerationsUseCase,
                [EnvironmentEnum.TESTING]: GetGenerationsUseCase,
            },
            ["GenerationRepository", "Logger"]
        );

        this.factory.register(
            "GetPokedexByIdUseCase",
            {
                [EnvironmentEnum.DEVELOPMENT]: GetPokedexByIdUseCase,
                [EnvironmentEnum.PRODUCTION]: GetPokedexByIdUseCase,
                [EnvironmentEnum.TESTING]: GetPokedexByIdUseCase,
            },
            ["PokedexRepository", "Logger"]
        );

        this.factory.register(
            "GetPokedexUseCase",
            {
                [EnvironmentEnum.DEVELOPMENT]: GetPokedexUseCase,
                [EnvironmentEnum.PRODUCTION]: GetPokedexUseCase,
                [EnvironmentEnum.TESTING]: GetPokedexUseCase,
            },
            ["PokedexRepository", "Logger"]
        );

        this.factory.register(
            "GetTypesUseCase",
            {
                [EnvironmentEnum.DEVELOPMENT]: GetTypesUseCase,
                [EnvironmentEnum.PRODUCTION]: GetTypesUseCase,
                [EnvironmentEnum.TESTING]: GetTypesUseCase,
            },
            ["TypeRepository", "Logger"]
        );

        this.factory.register(
            "GetTypeByIdUseCase",
            {
                [EnvironmentEnum.DEVELOPMENT]: GetTypeByIdUseCase,
                [EnvironmentEnum.PRODUCTION]: GetTypeByIdUseCase,
                [EnvironmentEnum.TESTING]: GetTypeByIdUseCase,
            },
            ["TypeRepository", "Logger"]
        );

        this.factory.register(
            "GenerationController",
            {
                [EnvironmentEnum.DEVELOPMENT]: GenerationController,
                [EnvironmentEnum.PRODUCTION]: GenerationController,
                [EnvironmentEnum.TESTING]: GenerationController,
            },
            ["GetGenerationsUseCase"]
        );

        this.factory.register(
            "PokedexController",
            {
                [EnvironmentEnum.DEVELOPMENT]: PokedexController,
                [EnvironmentEnum.PRODUCTION]: PokedexController,
                [EnvironmentEnum.TESTING]: PokedexController,
            },
            ["GetPokedexUseCase", "GetPokedexByIdUseCase"]
        );

        this.factory.register(
            "TypeController",
            {
                [EnvironmentEnum.DEVELOPMENT]: TypeController,
                [EnvironmentEnum.PRODUCTION]: TypeController,
                [EnvironmentEnum.TESTING]: TypeController,
            },
            ["GetTypesUseCase", "GetTypeByIdUseCase"]
        );
    }

    // ---------------- LIFECYCLE ----------------

    async bootstrap(): Promise<void> {
        const versionService = this.factory.resolve<DataVersionService>(
            "DataVersionService"
        );
        await versionService.syncIfNeeded();
    }

    async mount(): Promise<void> {
        const generationController = this.factory.resolve<GenerationController>(
            "GenerationController"
        );

        const pokedexController = this.factory.resolve<PokedexController>(
            "PokedexController"
        );

        const typeController = this.factory.resolve<TypeController>(
            "TypeController"
        );

        await generationController.loadData();
        await pokedexController.loadData("1");
        typeController.loadData();
    }
}
