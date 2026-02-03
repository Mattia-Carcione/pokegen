import { ITypeEffectivenessCalculator } from "@/modules/pokegen/application/services/contracts/ITypeEffectivenessCalculator";
import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { TypeEffectiveness, TypeMultiplier } from "@/modules/pokegen/domain/types/TypeEffectiveness";

/**
 * Calcolatore puro dell'efficacia dei tipi (offensiva e difensiva).
 */
export class TypeEffectivenessCalculator implements ITypeEffectivenessCalculator {
  calculate(details: TypeDto[], allTypes: string[]): TypeEffectiveness {
    const defenseMap = new Map<string, number>(allTypes.map((t) => [t, 1]));
    const offenseMap = new Map<string, number>(allTypes.map((t) => [t, 1]));

    for (const detail of details) {
      const rel = detail.damage_relations;

      rel.double_damage_from.forEach((t) => this.multiply(defenseMap, t.name, 2));
      rel.half_damage_from.forEach((t) => this.multiply(defenseMap, t.name, 0.5));
      rel.no_damage_from.forEach((t) => this.multiply(defenseMap, t.name, 0));

      rel.double_damage_to.forEach((t) => this.multiply(offenseMap, t.name, 2));
      rel.half_damage_to.forEach((t) => this.multiply(offenseMap, t.name, 0.5));
      rel.no_damage_to.forEach((t) => this.multiply(offenseMap, t.name, 0));
    }

    const defense = this.buildDefense(defenseMap);
    const offense = this.buildOffense(offenseMap);

    return { defense, offense };
  }

  private multiply(map: Map<string, number>, name: string, factor: number) {
    const key = name.toLowerCase();
    const current = map.get(key) ?? 1;
    if (current === 0) return;
    map.set(key, current * factor);
  }

  private buildDefense(map: Map<string, number>) {
    const weak: TypeMultiplier[] = [];
    const resist: TypeMultiplier[] = [];
    const immune: TypeMultiplier[] = [];
    const normal: TypeMultiplier[] = [];

    map.forEach((multiplier, name) => {
      if (multiplier === 0) immune.push({ name, multiplier });
      else if (multiplier > 1) weak.push({ name, multiplier });
      else if (multiplier < 1) resist.push({ name, multiplier });
      else normal.push({ name, multiplier });
    });

    return { weak, resist, immune, normal };
  }

  private buildOffense(map: Map<string, number>) {
    const strong: TypeMultiplier[] = [];
    const weak: TypeMultiplier[] = [];
    const noEffect: TypeMultiplier[] = [];
    const normal: TypeMultiplier[] = [];

    map.forEach((multiplier, name) => {
      if (multiplier === 0) noEffect.push({ name, multiplier });
      else if (multiplier > 1) strong.push({ name, multiplier });
      else if (multiplier < 1) weak.push({ name, multiplier });
      else normal.push({ name, multiplier });
    });

    return { strong, weak, noEffect, normal };
  }
}
