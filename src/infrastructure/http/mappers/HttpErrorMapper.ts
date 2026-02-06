import { HttpError } from "../errors/HttpError";
import { ErrorTypeEnum } from "../enums/ErrorTypeEnum";

import { NotFoundError } from "@/commons/errors/NotFoundError";
import { UnauthorizedError } from "@/commons/errors/UnauthorizedError";
import { ExternalServiceUnavailableError } from "@/commons/errors/ExternalServiceUnavailableError";

import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IMapper } from "@/core/contracts/application/IMapper";

/**
 * Mappa gli errori HTTP in errori specifici dell'applicazione.
 */
export class HttpErrorMapper implements IMapper<unknown, never> {
    constructor(private readonly logger: ILogger) {}
    /**
     * Mappa un errore HTTP in un errore specifico.
     * @param err - HttpError
     * @returns never
     */
    map(err: HttpError): never {
        this.logger.error("[HttpErrorMapper] - Mappatura errore HTTP", `Type: ${err.type}, Status: ${err.status}, URL: ${err.url}, Message: ${err.message}`);
        switch (err.type) {
            case ErrorTypeEnum.HTTP:
                switch (err.status) {
                    case 404:
                        throw new NotFoundError("Error: " + err.message + " Not Found. URL: " + err.url);
                    case 401:
                        throw new UnauthorizedError("Error: " + err.message + " Unauthorized. URL: " + err.url);
                    default:
                        throw new ExternalServiceUnavailableError("Error: " + err.message + " Service Unavailable. URL: " + err.url);
                }
            case ErrorTypeEnum.NETWORK:
            case ErrorTypeEnum.TIMEOUT:
                throw new ExternalServiceUnavailableError("Error connection: " + err.message + " URL: " + err.url);
            case ErrorTypeEnum.UNKNOWN:
                throw new ExternalServiceUnavailableError("Error unknown: " + err.message + " URL: " + err.url);
            default:
                throw new ExternalServiceUnavailableError("External Service Unavailable: " + err.message + " URL: " + err.url);
        }
    }
}
