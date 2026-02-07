// infrastructure/http/HttpClientFromFactory.ts
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IHttpClientFactory } from "@/core/contracts/infrastructure/http/IHttpClientFactory";
import { EndpointApi } from "@/commons/enums/EndpointApi";

export class HttpClientFromFactory implements IHttpClient {
    private readonly client: IHttpClient;

    constructor(factory: IHttpClientFactory) {
        this.client = factory.create(EndpointApi.EntryPoint);
    }

    get<T>(url: string, config?: any): Promise<T> {
        return this.client.get<T>(url, config);
    }
}
