/**
 * Interfaccia generica per i mapper che convertono oggetti da un tipo sorgente a un tipo destinazione.
 */
export interface IMapper<TSource, TDestination> {
    /**
     * Mappa un oggetto di tipo TSource in un oggetto di tipo TDestination.
     * @param source - L'oggetto sorgente da mappare.
     * @returns L'oggetto destinazione risultante dalla mappatura.
     */
    map(source: TSource, ...args: any): TDestination;
}