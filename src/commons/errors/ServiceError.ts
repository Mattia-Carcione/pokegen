import { ApplicationError } from "../../core/contracts/application/ApplicationError";
import { ApplicationErrorCode } from "../enums/ApplicationErrorCode";

/**
 * Rappresenta un errore di servizio.
 * @property message (string) - il messaggio di errore
 * @property originalError (Error) - l'errore riscontrato
 */
export class ServiceError extends ApplicationError {
    readonly code = ApplicationErrorCode.SERVICE_ERROR;
    constructor(message: string = "Service Error", public originalError?: Error) {
        super(message);
    }
}
