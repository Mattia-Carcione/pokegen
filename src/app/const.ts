/**
 * Titolo dell'applicazione.
 */
export const TITLE = 'PokeGén';

/**
 * Base URI per le risorse statiche (icone, immagini, ecc.)
 */
export const BASE_URI = '/pokegen/';

/**
 * Base URI per le risorse statiche (icone, immagini, ecc.)
 */
export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

/**
 * Base URI per le risorse statiche (icone, immagini, ecc.)
 */
export const TYPE_ICONS: Record<string, string> = {
  fire: `${BASE_URI}icons/types/fire.svg`,
  water: `${BASE_URI}icons/types/water.svg`,
  grass: `${BASE_URI}icons/types/grass.svg`,
  electric: `${BASE_URI}icons/types/electric.svg`,
  ground: `${BASE_URI}icons/types/ground.svg`,
  bug: `${BASE_URI}icons/types/bug.svg`,
  dark: `${BASE_URI}icons/types/dark.svg`,
  dragon: `${BASE_URI}icons/types/dragon.svg`,
  fairy: `${BASE_URI}icons/types/fairy.svg`,
  fighting: `${BASE_URI}icons/types/fighting.svg`,
  flying: `${BASE_URI}icons/types/flying.svg`,
  ghost: `${BASE_URI}icons/types/ghost.svg`,
  ice: `${BASE_URI}icons/types/ice.svg`,
  normal: `${BASE_URI}icons/types/normal.svg`,
  poison: `${BASE_URI}icons/types/poison.svg`,
  psychic: `${BASE_URI}icons/types/psychic.svg`,
  rock: `${BASE_URI}icons/types/rock.svg`,
  steel: `${BASE_URI}icons/types/steel.svg`,
  stellar: `${BASE_URI}icons/types/stellar.svg`,
};

/**
 * URI dell'immagine di default per i Pokémon senza immagine disponibile.
 */
export const DEFAUL_IMAGE = `${BASE_URI}default_image.svg`;