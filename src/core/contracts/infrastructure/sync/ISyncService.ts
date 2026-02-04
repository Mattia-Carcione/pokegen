/**
 * Interfaccia per la gestione della sincronizzazione delle versioni dei dati.
 */
export interface ISyncService {
 /**
  * Verifica se è necessario sincronizzare i dati.
  * @returns Una promessa che risolve quando la sincronizzazione è completata.
  */
  syncIfNeeded(): Promise<void>;
}