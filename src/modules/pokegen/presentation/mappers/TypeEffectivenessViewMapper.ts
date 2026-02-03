import { ITypeEffectivenessViewMapper } from "@/modules/pokegen/presentation/mappers/contracts/ITypeEffectivenessViewMapper";
import { TypeEffectiveness, TypeMultiplier } from "@/modules/pokegen/domain/types/TypeEffectiveness";
import { TypeEffectivenessVM, TypeMultiplierVM } from "@/modules/pokegen/presentation/viewmodels/types/TypeEffectivenessVM";
import { TYPE_COLORS, TYPE_ICONS } from "@/modules/pokegen/presentation/config/PokegenAssets";
import { StringHelper } from "@/core/utils/string/StringHelper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Mapper per trasformare l'efficacia tipi in ViewModel.
 */
export class TypeEffectivenessViewMapper implements ITypeEffectivenessViewMapper {
  constructor(private readonly logger: ILogger) { }
  private readonly hiddenTypes = new Set(["shadow", "unknown"]);

  map(source: TypeEffectiveness): TypeEffectivenessVM {
    this.logger.debug("[TypeEffectivenessViewMapper] - Mapping effectiveness to VM");

    return {
      defense: {
        weak: this.mapTypeMultipliers(source.defense.weak),
        resist: this.mapTypeMultipliers(source.defense.resist),
        immune: this.mapTypeMultipliers(source.defense.immune),
        normal: this.mapTypeMultipliers(source.defense.normal),
      },
      offense: {
        strong: this.mapTypeMultipliers(source.offense.strong),
        weak: this.mapTypeMultipliers(source.offense.weak),
        noEffect: this.mapTypeMultipliers(source.offense.noEffect),
        normal: this.mapTypeMultipliers(source.offense.normal),
      }
    };
  }

  private mapTypeMultipliers(list: TypeMultiplier[]): TypeMultiplierVM[] {
    return list
      .filter((t) => !this.hiddenTypes.has(t.name.toLowerCase()))
      .map((t) => ({
      name: t.name,
      label: StringHelper.capitalize(t.name),
      multiplier: t.multiplier,
      multiplierLabel: `x${t.multiplier}`,
      color: TYPE_COLORS[t.name],
      icon: TYPE_ICONS[t.name],
    }));
  }
}
