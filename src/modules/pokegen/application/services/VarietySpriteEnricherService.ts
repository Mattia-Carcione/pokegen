import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonSpriteProvider } from "../providers/contracts/IPokemonSpriteProvider";
import { ISpriteEnricherService } from "./contracts/ISpriteEnricherService";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Servizio per l'arricchimento delle sprite delle varietà dei Pokémon.
 */
export class VarietySpriteEnricherService implements ISpriteEnricherService {
  constructor(
    private readonly spriteProvider: IPokemonSpriteProvider,
    private readonly logger: ILogger
  ) {}

  /**
   * Arricchisce le sprite delle varietà per il Pokémon fornito.
   * @param input Il Pokémon da arricchire con le sprite delle varietà.
   */
  async enrich(input: Pokemon): Promise<void> {
    if (!input.varieties?.length) return;

    this.logger.debug(
      `[VarietySpriteEnricherService] - Arricchimento varieties per ${input.name}`
    );

    await Promise.all(
      input.varieties.map(async variety => {
        if (variety.pokemon.sprite) return;

        try {
          variety.pokemon.sprite =
            await this.spriteProvider.getSpriteByPokemonUrl(
              variety.pokemon.url
            );
        } catch (error) {
          this.logger.warn(
            `[VarietySpriteEnricherService] - Errore recupero sprite per ${variety.pokemon.name}`
          );
          throw error;
        }
      })
    );
  }
}
