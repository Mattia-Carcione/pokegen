import { IDataSource } from "@/core/contracts/application/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import type2 from "../../../../../../assets/mock_data/type-2.json";
import { TypeDto } from "@/modules/pokegen/application/dtos/TypeDto";

const typeById: Record<number, TypeDto> = {
    2: type2 as TypeDto,
};

/**
 * Data source mock per ottenere i dati dei type.
 */
export class TypeMockDataSource implements IDataSource<TypeDto> {
    constructor(
        _httpClient: IHttpClient,
        _httpErrorMapper: IMapper<unknown, never>,
        private readonly logger: ILogger
    ) { }

    async fetchData(endpoint?: string): Promise<TypeDto> {
        this.logger.debug(
            "[TypeMockDataSource] - Recupero mock Type con endpoint: " + (endpoint ?? "<none>")
        );

        const id = this.extractTypeId(endpoint);
        const mock = (id ? typeById[id] : typeById[2]) ?? null;

        if (!mock) {
            throw new ExternalServiceUnavailableError(
                "Mock type data not found for endpoint: " + (endpoint ?? "<none>")
            );
        }

        return mock;
    }

    private extractTypeId(endpoint?: string): number | null {
        if (!endpoint) return null;

        const trimmed = endpoint.trim();
        if (!trimmed) return null;

        const match = trimmed.match(/type\/(\d+)/i) || trimmed.match(/\b(\d+)\b/);
        if (!match) return null;

        const id = Number.parseInt(match[1], 10);
        return Number.isFinite(id) ? id : null;
    }
}
