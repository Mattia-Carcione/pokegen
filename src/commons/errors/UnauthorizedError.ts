import { ApplicationError } from "../../core/contracts/application/ApplicationError";
import { ApplicationErrorCode } from "../enums/ApplicationErrorCode";

/**
 * Errore per accesso non autorizzato.
 * 
 * Usato quando un'operazione richiede credenziali valide o permessi specifici.
 */
export class UnauthorizedError extends ApplicationError {
  readonly code = ApplicationErrorCode.UNAUTHORIZED;

  constructor(message = "Unauthorized access") {
    super(message);
  }
}
