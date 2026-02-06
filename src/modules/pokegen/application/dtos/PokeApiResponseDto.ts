import { NamedResource } from "@/commons/types/CommonTypes";

/**
 * Elenco paginato delle risorse disponibili per quell'API
 * 
 * @property count: Numero totale di risorse disponibili da questa API (number).
 * @property next: L'URL per la pagina successiva nell'elenco (string | null).
 * @property previous: L'URL della pagina precedente nell'elenco (string | null).
 * @property results: Un elenco di risorse API denominate (NamedResource[]).
 */
export interface PokeApiResponseDto {
    count: number;
    next: string | null;
    previous: string | null;
    results: NamedResource[];
}
