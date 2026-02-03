import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { MathHelper } from "@/core/utils/math/MathHelper";

export const mapPokemonSizeVM = (source: Pokemon) => {
  return {
    height: MathHelper.formatDecimeterValue(source.height),
    weight: MathHelper.formatDecimeterValue(source.weight),
  };
};
