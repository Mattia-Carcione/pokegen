import { TypeDto } from "@/modules/pokegen/data/models/dtos/TypeDto";
import { TypeEffectiveness } from "@/modules/pokegen/domain/types/TypeEffectiveness";

/**
 * Contratto per il calcolo dell'efficacia dei tipi a partire dai dettagli.
 */
export interface ITypeEffectivenessCalculator {
  /**
   * Calcola l'efficacia offensiva e difensiva dato un set di dettagli tipo.
   */
  calculate(details: TypeDto[], allTypes: string[]): TypeEffectiveness;
}
