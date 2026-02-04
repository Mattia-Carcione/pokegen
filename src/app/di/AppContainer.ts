import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { EnvironmentEnum } from "@/core/enums/EnvironmentEnum";
import { PokegenContainer } from "./pokegen/PokegenContainer";
import { SharedContainer } from "@/shared/factories/SharedContainer";
import { IUsePokeApiController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokeApiController";
import { IUseGenerationController } from "@/modules/pokegen/presentation/controllers/contracts/IUseGenerationController";
import { IUsePokemonController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokemonController";
import { IUsePokemonTypesController } from "@/modules/pokegen/presentation/controllers/contracts/IUsePokemonTypesController";
import { IUseVersionGroupsController } from "@/modules/pokegen/presentation/controllers/contracts/IUseVersionGroupsController";
import { IUseMoveDetailsController } from "@/modules/pokegen/presentation/controllers/contracts/IUseMoveDetailsController";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ISyncService } from "@/core/contracts/infrastructure/sync/ISyncService";

/**
 * Container per la gestione delle dipendenze dell'applicazione PokéGen.
 */
class AppContainer {
  readonly generationController: () => IUseGenerationController;
  readonly pokemonController: () => IUsePokemonController;
  readonly blobController: () => IUseControllerBase;
  readonly pokeApiController: () => IUsePokeApiController;
  readonly pokemonTypesController: () => IUsePokemonTypesController;
  readonly versionGroupsController: () => IUseVersionGroupsController;
  readonly moveDetailsController: () => IUseMoveDetailsController;
  readonly dataVersionService: () => ISyncService;
  readonly logger: () =>ILogger;

  constructor(env: EnvironmentEnum) {
    try {
      // --- CONTAINERS ---
      const { blobController, cache, httpClient, httpMapper, logger, dataVersionService } = SharedContainer.build(env);
      const { generationController, pokemonController, pokeApiController, pokemonTypesController, versionGroupsController, moveDetailsController } = PokegenContainer.build(env, { httpClient, httpMapper, cache, logger });

      // --- ASSIGNMENTS ---
      this.logger = () => logger;
      this.generationController = generationController;
      this.pokemonController = pokemonController;
      this.blobController = blobController;
      this.pokeApiController = pokeApiController;
      this.pokemonTypesController = pokemonTypesController;
      this.versionGroupsController = versionGroupsController;
      this.moveDetailsController = moveDetailsController;
      this.dataVersionService = () => dataVersionService;
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Istanza del container dell'applicazione PokéGen.
 */
export const appContainer = new AppContainer(
  import.meta.env.DEV
    ? EnvironmentEnum.DEVELOPMENT
    : EnvironmentEnum.PRODUCTION
);
