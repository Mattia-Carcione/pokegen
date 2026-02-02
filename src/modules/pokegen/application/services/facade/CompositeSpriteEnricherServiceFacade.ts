import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ISpriteEnricherService } from "../contracts/ISpriteEnricherService";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

/**
 * Facade per il servizio di arricchimento delle sprite dei Pokémon che combina più arricchitori.
 */
export class CompositeSpriteEnricherServiceFacade implements ISpriteEnricherService {
  constructor(
    private readonly enrichers: ISpriteEnricherService[],
    private readonly logger: ILogger
  ) {}

  /**
   * Arricchisce le sprite per il Pokémon fornito utilizzando tutti gli arricchitori registrati.
   * @param input Il Pokémon da arricchire con le sprite.
   */
  async enrich(input: Pokemon): Promise<void> {
    this.logger.debug(
      `[CompositeSpriteEnricherServiceFacade] - Inizio arricchimento sprite per ${input.name}`
    );
    for (const enricher of this.enrichers) {
      await enricher.enrich(input);
    }
  }
}
