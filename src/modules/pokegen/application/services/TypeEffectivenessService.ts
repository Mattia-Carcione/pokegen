import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ITypeEffectivenessService } from "@/modules/pokegen/application/services/contracts/ITypeEffectivenessService";
import { ITypeDetailRepository } from "@/modules/pokegen/domain/repositories/ITypeDetailRepository";
import { TypeEffectiveness } from "@/modules/pokegen/domain/types/TypeEffectiveness";
import { ITypeEffectivenessCalculator } from "@/modules/pokegen/application/services/contracts/ITypeEffectivenessCalculator";

/**
 * Servizio per calcolare l'efficacia dei tipi (offensiva e difensiva).
 */
export class TypeEffectivenessService implements ITypeEffectivenessService {
  constructor(
    private readonly typeDetailRepository: ITypeDetailRepository,
    private readonly calculator: ITypeEffectivenessCalculator,
    private readonly logger: ILogger
  ) { }

  async getEffectiveness(types: string[]): Promise<TypeEffectiveness> {
    const normalized = types.map((t) => t.toLowerCase());
    this.logger.debug("[TypeEffectivenessService] - Calcolo efficacia tipi: " + normalized.join(", "));

    const [details, allTypes] = await Promise.all([
      Promise.all(normalized.map((t) => this.typeDetailRepository.getAsync(t))),
      this.typeDetailRepository.getAllAsync()
    ]);

    const allTypeNames = allTypes.map((t) => t.name.toLowerCase());

    return this.calculator.calculate(details, allTypeNames);
  }
}
