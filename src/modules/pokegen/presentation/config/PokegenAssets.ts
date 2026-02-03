export const ASSET_BASE_URL = import.meta.env.BASE_URL ?? '/';

export const DEFAULT_POKEMON_IMAGE = `${ASSET_BASE_URL}default_image.svg`;

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
  fairy: "#D685AD",
  stellar: "#C7B8FF",
};

export const TYPE_ICONS: Record<string, string> = {
  fire: `${ASSET_BASE_URL}icons/types/fire.svg`,
  water: `${ASSET_BASE_URL}icons/types/water.svg`,
  grass: `${ASSET_BASE_URL}icons/types/grass.svg`,
  electric: `${ASSET_BASE_URL}icons/types/electric.svg`,
  ground: `${ASSET_BASE_URL}icons/types/ground.svg`,
  bug: `${ASSET_BASE_URL}icons/types/bug.svg`,
  dark: `${ASSET_BASE_URL}icons/types/dark.svg`,
  dragon: `${ASSET_BASE_URL}icons/types/dragon.svg`,
  fairy: `${ASSET_BASE_URL}icons/types/fairy.svg`,
  fighting: `${ASSET_BASE_URL}icons/types/fighting.svg`,
  flying: `${ASSET_BASE_URL}icons/types/flying.svg`,
  ghost: `${ASSET_BASE_URL}icons/types/ghost.svg`,
  ice: `${ASSET_BASE_URL}icons/types/ice.svg`,
  normal: `${ASSET_BASE_URL}icons/types/normal.svg`,
  poison: `${ASSET_BASE_URL}icons/types/poison.svg`,
  psychic: `${ASSET_BASE_URL}icons/types/psychic.svg`,
  rock: `${ASSET_BASE_URL}icons/types/rock.svg`,
  steel: `${ASSET_BASE_URL}icons/types/steel.svg`,
  stellar: `${ASSET_BASE_URL}icons/types/stellar.svg`,
};
