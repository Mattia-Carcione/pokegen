import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { EnvironmentEnum } from "@/core/enums/EnvironmentEnum";
import { AxiosClientFactory } from "@/infrastructure/http/client/axios/AxiosClientFactory";
import { BASE_API_URL } from "@/config/appConfig";
import { HttpErrorMapper } from "@/infrastructure/http/mappers/HttpErrorMapper";
import { RetryEnum } from "@/infrastructure/http/enums/RetryEnum";
import { Logger } from "@/infrastructure/logger/Logger";
import { PokegenContainer } from "./pokegen/PokegenContainer";
import { SharedContainer } from "@/shared/factories/SharedContainer";
import { IUsePokeApiController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokeApiController";
import { IUseGenerationController } from "@/modules/pokegen/presentation/controllers/contracts/IUseGenerationController";
import { IUsePokemonController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokemonController";
import { IUsePokemonTypesController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokemonTypesController";

/**
 * Container per la gestione delle dipendenze dell'applicazione PokéGen.
 */
class AppContainer {
  readonly generationController: () => IUseGenerationController;
  readonly pokemonController: () => IUsePokemonController;
  readonly blobController: () => IUseControllerBase;
  readonly pokeApiController: () => IUsePokeApiController;
  readonly pokemonTypesController: () => IUsePokemonTypesController;

  constructor(env: EnvironmentEnum) {
    // --- LOGGERS ---
    const logger = new Logger(env);
    try {

      // --- INFRASTRUCTURE ---
      const httpFactory = new AxiosClientFactory(logger);
      const httpClient = httpFactory.create(BASE_API_URL, {
        retry: 3,
        retryDelay: 1000,
        jitter: RetryEnum.FULL
      });

      // --- MAPPERS ---
      const httpMapper = new HttpErrorMapper(logger);

      // --- CONTAINERS ---
      const { blobController, cache } = SharedContainer.build(env, { httpClient, httpMapper, logger });
      const { generationController, pokemonController, pokeApiController, pokemonTypesController } = PokegenContainer.build(env, { httpClient, httpMapper, cache, logger });

      // --- ASSIGNMENTS ---
      this.generationController = generationController;
      this.pokemonController = pokemonController;
      this.blobController = blobController;
      this.pokeApiController = pokeApiController;
      this.pokemonTypesController = pokemonTypesController;

      logger.info("[AppContainer] - App avviata con successo.")
    } catch (error) {
      logger.error("[AppContainer] - Errore durante l'avvio dell'app." + (error as Error).message, error);
      throw error;
    }
  }
}

/**
 * Istanza del container dell'applicazione PokéGen.
 */
export const appContainer = new AppContainer(
  !import.meta.env.DEV
    ? EnvironmentEnum.DEVELOPMENT
    : EnvironmentEnum.PRODUCTION
);