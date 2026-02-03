import { ChainLinkDto } from "@/modules/pokegen/data/models/dtos/EvolutionChainDto";
import { PokemonEvolution } from "@/modules/pokegen/domain/types/PokemonEvolution";

 /**
 * Funzione ricorsiva per attraversare la catena evolutiva e raccogliere le evoluzioni.
 * @param node Il nodo corrente della catena evolutiva.
 * @returns Una mappa delle evoluzioni del Pokémon.
 */
export function traverse(node: ChainLinkDto, evolutionsMap: Map<string, PokemonEvolution>): Map<string, PokemonEvolution> {
    for (const next of node.evolves_to) {
        const key = `${node.species.name}|${next.species.name}`;
        if (!evolutionsMap.has(key)) {
            const detail = next.evolution_details[0];
            evolutionsMap.set(key, {
                from: node.species.name,
                to: next.species.name,
                trigger: detail.trigger.name,
                minLevel: detail.min_level ?? undefined,
                heldItem: detail.held_item?.name,
                item: detail.item?.name,
                minSteps: detail.min_steps ?? undefined,
                gender: detail.gender,
                timeOfDay: detail.time_of_day || undefined,
                needsOverworldRain: detail.needs_overworld_rain || undefined,
                knownMove: detail.known_move?.name,
                knownMoveType: detail.known_move_type?.name,
                location: detail.location?.name,
                minHappiness: detail.min_happiness ?? undefined,
                minBeauty: detail.min_beauty ?? undefined,
                minAffection: detail.min_affection ?? undefined,
                relativePhysicalStats: detail.relative_physical_stats ?? undefined,
                partySpecies: detail.party_species?.name,
                partyType: detail.party_type?.name,
                tradeSpecies: detail.trade_species?.name,
                minMoveCount: detail.min_move_count ?? undefined,
                needsMultiplayer: detail.needs_multiplayer || undefined,
                turnUpsideDown: detail.turn_upside_down || undefined,
                usedMove: detail.used_move?.name
            });
        }
        traverse(next, evolutionsMap);
    }
    return evolutionsMap;
};