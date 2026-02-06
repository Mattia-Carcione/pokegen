/**
 * Rappresenta il risultato di un'operazione che può avere successo o fallire.
 * 
 * @template T - Tipo del dato restituito in caso di successo.
 * @template E - Tipo dell'errore restituito in caso di fallimento (default: string).
 */
export class Result<T, E = string> {
    private constructor(
        public readonly isSuccess: boolean,
        public readonly data?: T,
        public readonly error?: E
    ) { }

    /**
     * Crea un'istanza di Result che rappresenta un successo.
     * @param data - Il dato restituito in caso di successo.
     * @returns Un'istanza di Result con isSuccess true.
     */
    static success<T, E = string>(data: T): Result<T, E> {
        return new Result<T, E>(true, data);
    }

    /**
     * Crea un'istanza di Result che rappresenta un fallimento.
     * @param error - L'errore restituito in caso di fallimento.
     * @returns Un'istanza di Result con isSuccess false.
     */
    static fail<T, E = string>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }
} 