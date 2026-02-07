import { IRepository } from "@/core/contracts/application/IRepository";
import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IMapper } from "@/core/contracts/application/IMapper";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { EndpointApi } from "@/commons/enums/EndpointApi";
import { NetworkHelper } from "@/commons/utils/network/ReplaceUrl";

import { Pokedex } from "../../domain/entities/Pokedex";

import { PokeApiResponseDto } from "../../application/dtos/PokeApiResponseDto";
import { PokedexDto } from "../../application/dtos/PokedexDto";

export class PokedexRepository implements IRepository<Pokedex> {
    constructor(
        private readonly baseDataSource: IDataSource<PokeApiResponseDto>,
        private readonly dataSource: IDataSource<PokedexDto>,
        private readonly mapper: IMapper<PokedexDto, Pokedex>,
        private readonly cache: ICache<Pokedex[]>,
        private readonly logger: ILogger
    ) { }

    async getAllAsync(): Promise<Pokedex[]> {
        this.logger.debug("[PokedexRepository] - Recupero di tutti i Pokedex.");
        const cacheKey = this.cache.generateKey("pokedexRepository", "getAllAsync", EndpointApi.Pokedex);
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            this.logger.debug("[PokedexRepository] - Dati dei Pokedex recuperati dalla cache.");
            return cachedData;
        }

        const response = await this.baseDataSource.fetchData(EndpointApi.Pokedex);
        const task = response.results.map(async (item) => {
            const id = NetworkHelper.matchUrlPattern(item.url, "pokedex");
            return this.getAsync(id.toString());
        });
        const pokedexList = await Promise.all(task);
        this.cache.set(cacheKey, pokedexList);
        this.logger.debug("[PokedexRepository] - Dati dei Pokedex recuperati dalla data source e memorizzati in cache.");
        return pokedexList;
    }

    async getAsync(id: string): Promise<Pokedex> {
        this.logger.debug("[PokedexRepository] - Recupero di un singolo Pokedex.");
        const cacheKey = this.cache.generateKey("pokedexRepository", "getAsync", id);
        const cached = this.cache.get(cacheKey);
        if (cached) {
            const found = cached.find((pokedex) => pokedex.id === Number(id));
            if (found) {
                this.logger.debug("[PokedexRepository] - Dati del Pokedex recuperati dalla cache.");
                return found;
            }
        }

        const endpoint = NetworkHelper.replaceUrl(EndpointApi.Pokedex, id);
        const dto = await this.dataSource.fetchData(endpoint);
        const entity = this.mapper.map(dto);

        this.cache.set(cacheKey, [...(cached || []), entity]);
        this.logger.debug("[PokedexRepository] - Dati del Pokedex recuperati dalla data source e memorizzati in cache.");
        return entity;
    }
}
