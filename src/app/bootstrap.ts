import { appContainer } from "./di/AppContainer";

/**
 * Funzione di bootstrap dell'applicazione.
 */
export async function bootstrapApp(): Promise<void> {
    const logger = appContainer.logger();
    logger.info("[bootstrapApp] - Avvio della procedura di bootstrap dell'applicazione.");
    const dataVersionService = appContainer.dataVersionService();

    await dataVersionService.syncIfNeeded();
    logger.info("[bootstrapApp] - Procedura di bootstrap completata con successo.");
}