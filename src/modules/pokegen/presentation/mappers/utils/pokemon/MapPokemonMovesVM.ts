import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { formatDisplayName } from "./FormatName";

export const mapPokemonMovesVM = (source: Pokemon) => {
  return source.moves?.map((move) => ({
    slug: move.slug,
    name: formatDisplayName(move.name),
    details: move.details.map((detail) => ({
      level: detail.level,
      method: detail.method,
      versionGroup: detail.versionGroup,
    })),
  }));
};
