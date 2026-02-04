import { ISyncService } from "@/core/contracts/infrastructure/sync/ISyncService";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ICacheDb } from "@/core/contracts/infrastructure/database/ICacheDb";

/**
 * Tipo per i metadati remoti della versione dei dati.
 */
type RemoteMetaData = {
  date: string;
  version: string;
  syncedAt?: string;
};

/**
 * Classe per la gestione della sincronizzazione delle versioni dei dati.
 */
export class DataVersionService implements ISyncService {
    private readonly META_KEY = 'global';

    constructor(
        private readonly cacheDb: ICacheDb,
        private readonly logger: ILogger
    ) {}
    
    /**
     * Verifica se è necessario sincronizzare i dati.
     * @returns Una promessa che risolve quando la sincronizzazione è completata.
     */
    async syncIfNeeded(): Promise<void> {
        this.logger.debug("[DataVersionService] - Verifica della necessità di sincronizzazione dei dati.");
        try {
            const remote = await this.fetchRemoteMetaData();
            const local = await this.cacheDb.getMetaData<RemoteMetaData>(this.META_KEY);

            if (!local || local.date !== remote.date || local.version !== remote.version) {
                this.logger.debug("[DataVersionService] - Sincronizzazione necessaria. Aggiornamento dei metadati locali.");
                await this.cacheDb.clearStore();
                await this.cacheDb.setMetaData<RemoteMetaData>(this.META_KEY, {
                    date: remote.date,
                    version: remote.version,
                    syncedAt: new Date().toISOString()
                });
            } else {
                this.logger.debug("[DataVersionService] - Nessuna sincronizzazione necessaria.");
                return;
            }
        } catch (error) {
            this.logger.error("[DataVersionService] - Errore durante la verifica della sincronizzazione dei dati.", error);
            throw error;
        }
    }

    /**
     * Recupera i metadati remoti.
     * @returns Una promessa che risolve i metadati remoti.
     */
    private async fetchRemoteMetaData(): Promise<RemoteMetaData> {
        const response = await fetch('/pokegen/data/meta.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch remote metadata: ${response.statusText}`);
        }
        return response.json();
    }
}