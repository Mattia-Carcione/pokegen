/** 
 * delay(ms: number): Promise<void> 
 * è una funzione che ritorna una Promise risolta dopo ms millisecondi. 
 * Serve per sospendere asincronamente l’esecuzione 
 * (in retry viene usata per attendere tra i tentativi, quindi è un ritardo tra un tentativo e l'altro).
 */
export function delay(ms: number,): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
}