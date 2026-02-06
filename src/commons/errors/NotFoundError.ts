import { ApplicationError } from "../../core/contracts/application/ApplicationError";
import { ApplicationErrorCode } from "../enums/ApplicationErrorCode";

/**
 * Errore per risorsa non trovata.
 */
export class NotFoundError extends ApplicationError {
  readonly code = ApplicationErrorCode.NOT_FOUND;

  constructor(message = "Resource not found") {
    super(message);
  }
}
