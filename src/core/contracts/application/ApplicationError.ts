/**
 * Classe astratta per gli errori dell'applicazione.
 */
export abstract class ApplicationError extends Error {
  abstract readonly code: string;
}
