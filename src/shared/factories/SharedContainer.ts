import { EnvironmentEnum } from "@/core/enums/EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { UseBlobController } from "../presentation/controllers/UseBlobController";
import { FactoryHelper } from "@/core/utils/factories/FactoryHelper";
import { BlobRepository } from "../data/repositories/BlobRepository";
import { GetBlobUseCase } from "../application/usecases/GetBlobUseCase";
import { BlobDataSource } from "../data/datasources/BlobDataSource";
import { BlobMockDataSource } from "../data/datasources/mock/BlobMockDataSource";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { InMemoryCache } from "@/infrastructure/cache/InMemoryCache";
import { RetryEnum } from "@/infrastructure/http/enums/RetryEnum";
import { BASE_API_URL } from "@/config/appConfig";
import { AxiosClientFactory } from "@/infrastructure/http/client/axios/AxiosClientFactory";
import { Logger } from "@/infrastructure/logger/Logger";
import { CacheDb } from "@/infrastructure/indexedDb/CacheDb";
import { HttpErrorMapper } from "@/infrastructure/http/mappers/HttpErrorMapper";
import { DataVersionService } from "@/infrastructure/sync/DataVersionService";
import { ISyncService } from "@/core/contracts/infrastructure/sync/ISyncService";

/**
 * Classe factory per la creazione di controller e dipendenze condivise.
 */
export class SharedContainer {
    private constructor() {}

    /**
     * Crea e restituisce un oggetto contenente i controller
     * @param env L'ambiente di esecuzione.
     * @param deps Le dipendenze necessarie per la creazione dei controller.
     * @returns Un oggetto contenente i controller relativi ai Blob.
     */
    static build(env: EnvironmentEnum): { 
        blobController: () => IUseControllerBase,
        cache: ICache<any>,
        logger: ILogger,
        httpClient: IHttpClient,
        httpMapper: IHttpErrorMapper,
        dataVersionService: ISyncService
    } {
        // --- LOGGERS ---
        const logger = FactoryHelper.create(Logger, env);

        // --- INFRASTRUCTURE ---
        const cache: ICache<any> = FactoryHelper.create(InMemoryCache);
        const cacheDb = FactoryHelper.create(CacheDb, logger);
        const httpFactory = new AxiosClientFactory(cacheDb, logger);
        const httpClient = httpFactory.create(BASE_API_URL, {
        retry: 3,
        retryDelay: 1000,
        jitter: RetryEnum.FULL
        });
        const dataVersionService = FactoryHelper.create(DataVersionService, cacheDb, logger);

        // --- HTTP DEPENDENCIES ---
        const httpMapper = FactoryHelper.create(HttpErrorMapper, logger);

        // --- BLOB DEPENDENCIES ---
        const blobDataSource = FactoryHelper.createByEnvHelper<IDataSource<Blob>>(env, BlobDataSource, BlobMockDataSource, httpClient, httpMapper, logger);
        
        const blobRepository = FactoryHelper.create(BlobRepository, blobDataSource, cache, logger);

        const blobUseCase = FactoryHelper.create(GetBlobUseCase, blobRepository, logger);
        return {
            blobController: () => FactoryHelper.create(UseBlobController, blobUseCase, logger),
            cache: cache,
            logger: logger,
            httpClient: httpClient,
            httpMapper: httpMapper,
            dataVersionService: dataVersionService
        }
    }
}
