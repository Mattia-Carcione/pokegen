import { TypeEffectiveness } from "@/modules/pokegen/domain/types/TypeEffectiveness";

/**
 * Contratto per il servizio di calcolo dell'efficacia dei tipi.
 */
export interface ITypeEffectivenessService {
  /**
   * Calcola l'efficacia offensiva e difensiva dato un set di tipi.
   * @param types - Lista dei nomi dei tipi.
   */
  getEffectiveness(types: string[]): Promise<TypeEffectiveness>;
}
