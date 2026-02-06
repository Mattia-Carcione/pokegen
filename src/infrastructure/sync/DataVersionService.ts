import { ISyncService } from "@/core/contracts/infrastructure/sync/ISyncService";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ICacheDb } from "@/core/contracts/infrastructure/database/ICacheDb";

/**
 * Tipo per i metadati remoti della versione dei dati.
 */
type RemoteMetaData = {
    dataVersion: string;
    timestamp: string;
    namespaces?: Record<string, string>;
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

            if (!local) {
                this.logger.debug("[DataVersionService] - Primo avvio, memorizzo metadati remoti.");
                await this.cacheDb.setMetaData<RemoteMetaData>(this.META_KEY, remote);
                return;
            }

            const namespacesToClear: string[] = [];

            pushNamespaceToClear(remote, local, namespacesToClear);

            await this.executeClearStore(namespacesToClear, local, remote);

            await this.cacheDb.setMetaData<RemoteMetaData>(this.META_KEY, remote);

            if (namespacesToClear.length === 0) {
                this.logger.debug("[DataVersionService] - Nessuna sincronizzazione necessaria.");
                return;
            }
        } catch (error) {
            this.logger.error("[DataVersionService] - Errore durante la verifica della sincronizzazione dei dati.", error);
            throw error;
        }
    }

    private async executeClearStore(namespacesToClear: string[], local: RemoteMetaData, remote: RemoteMetaData) {
        if (namespacesToClear.length > 0) {
            this.logger.debug(`[DataVersionService] - Sincronizzazione necessaria per i namespace: ${namespacesToClear.join(', ')}. Pulizia in corso...`);
            await this.cacheDb.clearStoreByPrefixes(namespacesToClear);
        } else if (local.dataVersion !== remote.dataVersion) {
            // Fallback: se cambia la dataVersion ma namespaces uguali, clear globale
            this.logger.debug("[DataVersionService] - Cambio dataVersion, clear globale");
            await this.cacheDb.clearStore();
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

function pushNamespaceToClear(remote: RemoteMetaData, local: RemoteMetaData, namespacesToClear: string[]) {
    for (const ns of Object.keys(remote.namespaces || {})) {
        if (!local.namespaces || local.namespaces[ns] !== remote.namespaces![ns]) {
            namespacesToClear.push(ns);
        }
    }
}
