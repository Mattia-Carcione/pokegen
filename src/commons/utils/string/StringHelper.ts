/**
 * Utility per la manipolazione delle stringhe.
 */
export class StringHelper {
    private constructor() { }

    /**
     * Restituisce la stringa con la prima lettera maiuscola.
     * @param str La stringa da capitalizzare.
     * @returns La stringa capitalizzata.
     */
    static capitalize(str: string): string {
        if (str.length === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Applica il padding a sinistra di una stringa fino a raggiungere una lunghezza specificata.
     * @param str La stringa da paddingare.
     * @param length La lunghezza desiderata.
     * @param padChar Il carattere di padding da utilizzare (default: '0').
     * @returns La stringa con il padding applicato.
     */
    static applyPadding(str: string, length: number, padChar: string = '0'): string {
        if (!str || str.length >= length) return str;
        return str.padStart(length, padChar);
    }

    /**
     * Sostituisce gli hyphen in una stringa e restituisce un array di sottostringhe.
     * @param input La stringa di input.
     * @returns Un array di sottostringhe separate dagli hyphen.
     */
    static splitByHyphen(input: string): string[] {
        if(!input || !input.includes('-')) return [];
        
        return input.split(/-/g);
    }

    /**
     * Sostituisce tutte le occorrenze di una sottostringa in una stringa con un'altra sottostringa.
     * @param input La stringa di input.
     * @param searchValue La sottostringa da cercare.
     * @param replaceValue La sottostringa da sostituire.
     * @returns La stringa risultante con le sostituzioni effettuate.
     */
    static replace(input: string, searchValue: string, replaceValue: string): string {
        if(!input) return input;
        return input.replace(new RegExp(searchValue, 'g'), replaceValue);
    }
}