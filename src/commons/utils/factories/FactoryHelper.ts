import { EnvironmentEnum } from "@/core/environments/EnvironmentEnum";

/**
 * Classe factory helper per la creazione di istanze in base all'ambiente.
 */
export class FactoryHelper {
    private constructor() {}
    
    /**
     * Crea e restituisce un'istanza di un tipo specifico.
     * @param type Il tipo dell'istanza da creare.
     * @param args Gli argomenti necessari per la creazione dell'istanza.
     * @returns Un'istanza del tipo richiesto.
     */
    static create<T>(type: new (...args: any[]) => T, ...args: any[]): T {
        return new type(...args);
    }

    /**
     * Funzione utility per l'istanza delle classi in base all'ambiente.
     * @param env (EnvironmentEnum) - Variabile di ambiente.
     * @param prod (() => T) - Classe da istanziare in ambiente di produzione.
     * @param dev (() => T) - Classe da istanziare in ambiente di sviluppo.
     * @returns Ritorna l'istanza della classe in base alla variabile di ambiente passata in input
     */
    static createByEnvHelper<T>(env: EnvironmentEnum, prod: new (...args: any[]) => T, dev: new (...args: any[]) => T, ...args: any[]): T {
        switch (env) {
            case EnvironmentEnum.DEVELOPMENT:
                return new dev(...args);
            case EnvironmentEnum.PRODUCTION:
                return new prod(...args);
            default:
                throw new Error(`FactoryHelper: ambiente non supportato ${env}`);
        }
    }
}
