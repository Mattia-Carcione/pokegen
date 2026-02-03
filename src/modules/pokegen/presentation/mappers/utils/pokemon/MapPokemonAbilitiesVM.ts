import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { AbilitySlotMap } from "@/modules/pokegen/presentation/enums/AbilitySlotMap";
import { formatDisplayName } from "./FormatName";

export const mapPokemonAbilitiesVM = (source: Pokemon) => {
  return source.abilities?.map((ability) => ({
    slot: ability.isHidden ? "Hidden" : AbilitySlotMap[ability.slot] || "Unknown",
    name: formatDisplayName(ability.name),
    isHidden: ability.isHidden,
  }));
};
