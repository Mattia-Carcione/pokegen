import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { PokegenRouteName } from "@/modules/pokegen/presentation/routing/PokegenRouteName";
import { DEFAULT_POKEMON_IMAGE } from "@/modules/pokegen/presentation/config/PokegenAssets";
import { formatDisplayName } from "./FormatName";

export const mapPokemonVarietiesVM = (source: Pokemon) => {
  return source.varieties?.map((variety) => ({
    isDefault: variety.is_default,
    pokemon: {
      name: formatDisplayName(variety.pokemon.name),
      href: { name: PokegenRouteName.Pokemon, params: { name: variety.pokemon.name } },
      sprite: variety.pokemon.sprite || DEFAULT_POKEMON_IMAGE,
    },
  }));
};
