import { ApplicationError } from "../../core/contracts/application/ApplicationError";
import { ApplicationErrorCode } from "../enums/ApplicationErrorCode";

/**
 * Errore per servizio esterno non disponibile.
 */
export class ExternalServiceUnavailableError extends ApplicationError {
  readonly code = ApplicationErrorCode.EXTERNAL_SERVICE_UNAVAILABLE;

  constructor(message = "External service unavailable") {
    super(message);
  }
}
