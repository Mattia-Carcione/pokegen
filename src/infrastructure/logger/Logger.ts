import { EnvironmentEnum } from "@/core/environments/EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Implementazione concreta di ILogger che utilizza la console per il logging.
 */
export class Logger implements ILogger {
    constructor(protected readonly env: EnvironmentEnum) {}
    /**
     * Logga un messaggio di info.
     * @param message Il messaggio da loggare. 
     * @param optionalParams Opzionali parametri aggiuntivi. 
     */
    info(message: string, ...optionalParams: any[]): void {
        console.info(`[INFO] ${message}`, ...optionalParams);
    }

    /**
     * Logga un messaggio di avviso.
     * @param message Il messaggio da loggare.  
     * @param optionalParams Opzionali parametri aggiuntivi. 
     */
    warn(message: string, ...optionalParams: any[]): void {
        console.warn(`[WARN] ${message}`, ...optionalParams);
    }
    /**
     * Logga un messaggio di errore.
     * @param message Il messaggio da loggare.  
     * @param optionalParams Opzionali parametri aggiuntivi. 
     */
    error(message: string, ...optionalParams: any[]): void {
        console.error(`[ERROR] ${message}`, ...optionalParams);
    }

    /**
     * Logga un messaggio di debug.
     * @param message Il messaggio da loggare.  
     * @param optionalParams Opzionali parametri aggiuntivi. 
     */
    debug(message: string, ...optionalParams: any[]): void {
        if(this.env === EnvironmentEnum.DEVELOPMENT)
            console.debug(`[DEBUG] ${message}`, ...optionalParams);
    }

    /**
     * Logga un messaggio generico.
     * @param message Il messaggio da loggare.  
     * @param optionalParams Opzionali parametri aggiuntivi. 
     */
    log(message: string, ...optionalParams: any[]): void {
        console.log(`[LOG] ${message}`, ...optionalParams);
    }
}