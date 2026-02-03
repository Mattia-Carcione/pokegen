import { PokemonEvolution } from "@/modules/pokegen/domain/types/PokemonEvolution";
import { PokemonEvolutionVM } from "../../../viewmodels/types/EvolutionStageVM";
import { DEFAULT_POKEMON_IMAGE } from "@/modules/pokegen/presentation/config/PokegenAssets";
import { pokemonGenderMap } from "../../../enums/PokemonGendereMap";
import { PokegenRouteName } from "@/modules/pokegen/presentation/routing/PokegenRouteName";
import { StringHelper } from "@/core/utils/string/StringHelper";

/**
 * Costruisce un oggetto PokemonEvolutionVM per la visualizzazione dell'evoluzione del Pokémon.
 * @param e - L'oggetto PokemonEvolution da convertire.
 * @returns Un oggetto PokemonEvolutionVM con i dettagli dell'evoluzione.
 */
export function buildEvolutionVM(e: PokemonEvolution): PokemonEvolutionVM {
    const base = {
        from: e.from,
        to: e.to,
        sprite: e.spriteTo ?? DEFAULT_POKEMON_IMAGE,
        minLevel: e.minLevel,
        heldItem: e.heldItem,
        item: e.item,
        itemSprite: e.item ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${e.item.toLowerCase()}.png` : undefined,
        minSteps: e.minSteps,
        gender: pokemonGenderMap[e.gender ?? 0],
        timeOfDay: StringHelper.replace(e.timeOfDay ?? "", '-',' '),
        needsOverworldRain: e.needsOverworldRain,
        knownMove: e.knownMove,
        knownMoveType: e.knownMoveType,
        location: StringHelper.replace(e.location ?? "", '-',' '),
        minHappiness: e.minHappiness,
        minBeauty: e.minBeauty,
        minAffection: e.minAffection,
        relativePhysicalStats: e.relativePhysicalStats,
        partySpecies: e.partySpecies,
        partyType: e.partyType,
        tradeSpecies: e.tradeSpecies,
        minMoveCount: e.minMoveCount,
        needsMultiplayer: e.needsMultiplayer,
        turnUpsideDown: e.turnUpsideDown,
        usedMove: e.usedMove ? StringHelper.replace(e.usedMove, '-',' ') : undefined,
        trigger: StringHelper.replace(e.trigger ?? "", '-',' '),
        href: { name: PokegenRouteName.Pokemon, params: { name: e.to } },
        info: [
            StringHelper.replace(e.trigger ?? "", '-', ' ') && !e.item && StringHelper.replace(e.trigger ?? "", '-', ' '),
            e.minSteps && `After ${e.minSteps} steps`,
            e.usedMove && StringHelper.replace(e.usedMove ?? "", '-', ' '),
            e.minBeauty && `Beauty ${e.minBeauty}`,
            e.minAffection && `With Affection`,
            e.minMoveCount && `After ${e.minMoveCount} times`,
            e.gender && `(${pokemonGenderMap[e.gender ?? 0]})`,
            e.minLevel && `Level ${e.minLevel}`,
            e.minHappiness && 'Happiness',
            e.timeOfDay && `(${StringHelper.replace(e.timeOfDay ?? '', '-', ' ')})`,
            e.knownMove && `Knowing move:\n${e.knownMove}`,
            e.knownMoveType && `Knowing move type:\n${e.knownMoveType}`,
            e.location && `at ${StringHelper.replace(e.location ?? '', '-', ' ')}`,
            e.relativePhysicalStats !== undefined && `Physical stats ${e.relativePhysicalStats > 0 ? '>' : '<'}`
        ].filter(Boolean) as string[]
    }
    
    return base;
}