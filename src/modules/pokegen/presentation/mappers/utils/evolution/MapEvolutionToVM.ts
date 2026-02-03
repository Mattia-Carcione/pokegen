import { PokemonEvolution } from "@/modules/pokegen/domain/types/PokemonEvolution";
import { PokemonVM } from "@/modules/pokegen/presentation/viewmodels/types/PokemonVM";
import { EvolutionStageVM } from "@/modules/pokegen/presentation/viewmodels/types/EvolutionStageVM";
import { DEFAULT_POKEMON_IMAGE } from "@/modules/pokegen/presentation/config/PokegenAssets";
import { buildPokemonVM } from "@/modules/pokegen/presentation/mappers/utils/evolution/BuildPokemonVM";
import { buildEvolutionVM } from "@/modules/pokegen/presentation/mappers/utils/evolution/BuildEvolutionVM";

/**
 * Mappa le evoluzioni del Pokémon in un array di EvolutionStageVM per la visualizzazione.
 * @param evolutions - L'array di evoluzioni del Pokémon.
 * @param pokemon - Il PokémonVM di base.
 * @returns Un array di EvolutionStageVM rappresentanti le fasi di evoluzione del Pokémon.
 */
export const mapEvolutionToVM = (evolutions: PokemonEvolution[] | undefined, pokemon: PokemonVM): EvolutionStageVM[] => {
  if (!evolutions || evolutions.length === 0) {
    return [{
      pokemons: buildPokemonVM(pokemon.name, pokemon.sprite),
      evolutions: [],
    }];
  }

  const stageMap: Record<string, EvolutionStageVM> = {};
  for (const evo of evolutions) {
    if (!stageMap[evo.from]) {
      stageMap[evo.from] = {
        pokemons: buildPokemonVM(evo.from, evo.spriteFrom ?? DEFAULT_POKEMON_IMAGE),
        evolutions: [],
      };
    }
    stageMap[evo.from].evolutions!.push(buildEvolutionVM(evo));
  }

  return Object.values(stageMap);
};
