import { IRepository } from "@/core/contracts/application/IRepository";
import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IMapper } from "@/core/contracts/application/IMapper";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";

import { Type } from "../../domain/entities/Type";

import { PokeApiResponseDto } from "../../application/dtos/PokeApiResponseDto";
import { TypeDto } from "../../application/dtos/TypeDto";

export class TypeRepository implements IRepository<Type> {
    constructor(
        private readonly baseDataSource: IDataSource<PokeApiResponseDto>,
        private readonly dataSource: IDataSource<TypeDto>,
        private readonly mapper: IMapper<TypeDto, Type>,
        private readonly cache: ICache<Type[]>,
        private readonly logger: ILogger
    ) { }

    async getAllAsync(): Promise<Type[]> {
        this.logger.debug("[TypeRepository] - Recupero di tutti i type.");
        const cacheKey = this.cache.generateKey("typeRepository", "getAllAsync", EndpointApi.Type);
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            this.logger.debug("[TypeRepository] - Dati dei type recuperati dalla cache.");
            return cachedData;
        }

        const response = await this.baseDataSource.fetchData(EndpointApi.Type);
        const task = response.results.map(async (item) => {
            const id = NetworkHelper.matchUrlPattern(item.url, "type");
            return this.getAsync(id.toString());
        });
        const types = await Promise.all(task);
        this.cache.set(cacheKey, types);
        this.logger.debug("[TypeRepository] - Dati dei type recuperati dalla data source e memorizzati in cache.");
        return types;
    }

    async getAsync(id: string): Promise<Type> {
        this.logger.debug("[TypeRepository] - Recupero di un singolo type.");
        const cacheKey = this.cache.generateKey("typeRepository", "getAsync", id);
        const cached = this.cache.get(cacheKey);
        if (cached) {
            const found = cached.find((item) => item.id === Number(id));
            if (found) {
                this.logger.debug("[TypeRepository] - Dati del type recuperati dalla cache.");
                return found;
            }
        }

        const endpoint = NetworkHelper.replaceUrl(EndpointApi.Type, id);
        const dto = await this.dataSource.fetchData(endpoint);
        const entity = this.mapper.map(dto);

        this.cache.set(cacheKey, [...(cached || []), entity]);
        this.logger.debug("[TypeRepository] - Dati del type recuperati dalla data source e memorizzati in cache.");
        return entity;
    }
}
