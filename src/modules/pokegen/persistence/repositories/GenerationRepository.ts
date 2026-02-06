import { IRepository } from "@/core/contracts/application/IRepository";
import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IMapper } from "@/core/contracts/application/IMapper";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";

import { Generation } from "../../domain/entities/Generation";

import { PokeApiResponseDto } from "../../application/dtos/PokeApiResponseDto";
import { GenerationDto } from "../../application/dtos/GenerationDto";

export class GenerationRepository implements IRepository<Generation> {
    constructor(
        private readonly baseDataSource: IDataSource<PokeApiResponseDto>,
        private readonly dataSource: IDataSource<GenerationDto>,
        private readonly mapper: IMapper<GenerationDto, Generation>,
        private readonly cache: ICache<Generation[]>,
        private readonly logger: ILogger
    ) { }

    async getAllAsync(): Promise<Generation[]> {
        this.logger.debug("[GenerationRepository] - Recupero di tutte le generazioni.");
        const cacheKey = this.cache.generateKey('generationRepository', 'getAllAsync', EndpointApi.Generation);
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            this.logger.debug("[GenerationRepository] - Dati delle generazioni recuperati dalla cache.");
            return cachedData;
        }

        const response = await this.baseDataSource.fetchData(EndpointApi.Generation);
        const task = response.results.map(async (item) => {
            const id = NetworkHelper.matchUrlPattern(item.url, 'generation');
            return this.getAsync(id.toString());
        });
        const generations = await Promise.all(task);
        this.cache.set(cacheKey, generations);
        this.logger.debug("[GenerationRepository] - Dati delle generazioni recuperati dalla data source e memorizzati in cache.");
        return generations;
    }

    async getAsync(id: string): Promise<Generation> {
        this.logger.debug("[GenerationRepository] - Recupero di una singola generazione.");
        const cacheKey = this.cache.generateKey('generationRepository', 'getAsync', id);
        const cached = this.cache.get(cacheKey);
        if (cached) {
            const found = cached.find(gen => gen.id === Number(id));
            if (found) {
                this.logger.debug("[GenerationRepository] - Dati della generazione recuperati dalla cache.");
                return found;
            }
        }

        const endpoint = NetworkHelper.replaceUrl(EndpointApi.Generation, id);
        const dto = await this.dataSource.fetchData(endpoint);
        const entity = this.mapper.map(dto);

        this.cache.set(cacheKey, [...(cached || []), entity]);
        this.logger.debug("[GenerationRepository] - Dati della generazione recuperati dalla data source e memorizzati in cache.");
        return entity;
    }
}