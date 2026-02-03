import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { PokegenRouteName } from "@/modules/pokegen/presentation/routing/PokegenRouteName";
import { MathHelper } from "@/core/utils/math/MathHelper";
import { StringHelper } from "@/core/utils/string/StringHelper";

export const mapPokemonGenerationVM = (source: Pokemon) => {
  const [generation, roman] = StringHelper.splitByHyphen(source.generation || "");
  if (!generation || !roman) return undefined;

  const label = StringHelper.capitalize(generation);
  const generationId = MathHelper.convertToArabicNumber(roman);
  return {
    href: { name: PokegenRouteName.Generation, params: { id: generationId ?? 1 } },
    name: `${label} ${roman.toUpperCase()}`,
  };
};
