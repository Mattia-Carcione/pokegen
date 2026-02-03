import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { PokemonVM } from "@/modules/pokegen/presentation/viewmodels/types/PokemonVM";
import { PokegenRouteName } from "@/modules/pokegen/presentation/routing/PokegenRouteName";
import { TYPE_COLORS, TYPE_ICONS } from "@/modules/pokegen/presentation/config/PokegenAssets";
import { StringHelper } from "@/core/utils/string/StringHelper";
import { formatDisplayName } from "./FormatName";

export const mapPokemonBaseVM = (source: Pokemon): PokemonVM => {
  return {
    id: source.id.toString(),
    sprite: source.sprite,
    pokedexNumber: StringHelper.applyPadding(source.id.toString(), 3, "0"),
    types: source.types.map((type) => ({
      color: TYPE_COLORS[type.name],
      icon: TYPE_ICONS[type.name],
      name: StringHelper.capitalize(type.name),
    })),
    name: formatDisplayName(source.nameSpecies),
    href: { name: PokegenRouteName.Pokemon, params: { name: source.nameSpecies } },
  };
};
