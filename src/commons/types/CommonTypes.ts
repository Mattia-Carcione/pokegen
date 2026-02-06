/**
 * Interfaccia base della pokeApi
 * 
 * @property id - Identificatore di questa risorsa (integer).
 * @property name - Nome di questa risorsa (string).
 */
export interface Base {
    id: number;
    name: string;
}

/**
 * Nome e URL della risorsa disponibile per quell'api
 * 
 * @property name: Il nome della risorsa referenziata (string).
 * @property url: L'URL della risorsa referenziata (string).
 */
export interface NamedResource {
    name: string;
    url: string;
}

/**
 * Rappresenta un nome localizzato per una risorsa.
 * 
 * @property language: La lingua di questo nome (NamedResource).
 * @property name: Il nome localizzato (string).
 */
export interface Names {
    language: NamedResource; 
    name: string;
}