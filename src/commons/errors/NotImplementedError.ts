import { ApplicationError } from "../../core/contracts/application/ApplicationError";
import { ApplicationErrorCode } from "../enums/ApplicationErrorCode";

/**
 * Errore per servizio esterno non disponibile.
 */
export class NotImplementedError extends ApplicationError {
  readonly code = ApplicationErrorCode.NOT_IMPLEMENTED;

  constructor(message = "Not implemented") {
    super(message);
  }
}
