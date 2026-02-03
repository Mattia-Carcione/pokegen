import { TypeEffectiveness } from "@/modules/pokegen/domain/types/TypeEffectiveness";
import { TypeEffectivenessVM } from "@/modules/pokegen/presentation/viewmodels/types/TypeEffectivenessVM";

/**
 * Contratto per il mapper di efficacia tipi verso ViewModel.
 */
export interface ITypeEffectivenessViewMapper {
  map(source: TypeEffectiveness): TypeEffectivenessVM;
}
