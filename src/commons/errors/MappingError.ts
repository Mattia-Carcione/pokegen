import { ApplicationError } from "../../core/contracts/application/ApplicationError";
import { ApplicationErrorCode } from "../enums/ApplicationErrorCode";

/**
 * Rappresenta un errore di mapping dei dati.
 * @property message (string) - il messaggio di errore
 * @property invalidDto (T) - il DTO non valido che ha causato l'errore
 */
export class MappingError<T> extends ApplicationError {
    readonly code = ApplicationErrorCode.MAPPING_ERROR;
    constructor(message: string, public invalidDto?: T, public originalError?: Error) {
        super(message);
    }
}
