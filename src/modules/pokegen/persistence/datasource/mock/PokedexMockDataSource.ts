import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import pokedex1 from "../../../../../../assets/mock_data/pokedex-1.json";
import { PokedexDto } from "@/modules/pokegen/application/dtos/PokedexDto";

const pokedexById: Record<number, PokedexDto> = {
    1: pokedex1 as PokedexDto,
};

/**
 * Data source mock per ottenere i dati dei Pokedex.
 */
export class PokedexMockDataSource implements IDataSource<PokedexDto> {
    constructor(
        _httpClient: IHttpClient,
        _httpErrorMapper: IMapper<unknown, never>,
        private readonly logger: ILogger
    ) { }

    async fetchData(endpoint?: string): Promise<PokedexDto> {
        this.logger.debug(
            "[PokedexMockDataSource] - Recupero mock Pokedex con endpoint: " + (endpoint ?? "<none>")
        );

        const id = this.extractPokedexId(endpoint);
        const mock = (id ? pokedexById[id] : pokedexById[1]) ?? null;

        if (!mock) {
            throw new ExternalServiceUnavailableError(
                "Mock pokedex data not found for endpoint: " + (endpoint ?? "<none>")
            );
        }

        return mock;
    }

    private extractPokedexId(endpoint?: string): number | null {
        if (!endpoint) return null;

        const trimmed = endpoint.trim();
        if (!trimmed) return null;

        const match = trimmed.match(/pokedex\/(\d+)/i) || trimmed.match(/\b(\d+)\b/);
        if (!match) return null;

        const id = Number.parseInt(match[1], 10);
        return Number.isFinite(id) ? id : null;
    }
}
