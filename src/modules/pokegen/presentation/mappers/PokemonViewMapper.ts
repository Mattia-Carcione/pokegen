import { MappingError } from "@/core/errors/MappingError";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonViewMapper } from "./contracts/IPokemonViewMapper";
import { PokegenRouteName } from "@/modules/pokegen/presentation/routing/PokegenRouteName";
import { DEFAULT_POKEMON_IMAGE, TYPE_COLORS, TYPE_ICONS } from "@/modules/pokegen/presentation/config/PokegenAssets";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MathHelper } from "@/core/utils/math/MathHelper";
import { PokemonVM } from "../viewmodels/types/PokemonVM";
import { StringHelper } from "@/core/utils/string/StringHelper";
import { PokemonEvolution } from "../../domain/types/PokemonEvolution";
import { EvolutionStageVM } from "../viewmodels/types/EvolutionStageVM";
import { buildPokemonVM } from "./utils/evolution/BuildPokemonVM";
import { buildEvolutionVM } from "./utils/evolution/BuildEvolutionVM";
import { AbilitySlotMap } from "../enums/AbilitySlotMap";

/**
 * Mapper per convertire i dati del Pokémon in un HomeViewModel.
 */
export class PokemonViewMapper implements IPokemonViewMapper {
    constructor(private readonly logger: ILogger) { }

    /**
     * Mappa un array di entità Pokemon in un HomeViewModel.
     * @param source - L'array di entità Pokemon da mappare
     * @returns L'oggetto HomeViewModel risultante dalla mappatura
     * @throws MappingError se la mappatura fallisce
     */
    map(source: Pokemon): PokemonVM {
        this.logger.debug(`[PokemonViewMapper] - Inizio della mappatura del Pokémon: ${source.name} (ID: ${source.id})`);

        try {
            return {
                id: source.id.toString(),
                sprite: source.sprite,
                pokedexNumber: StringHelper.applyPadding(source.id.toString(), 3, '0'),
                types: source.types.map(type => ({
                    color: TYPE_COLORS[type.name],
                    icon: TYPE_ICONS[type.name],
                    name: StringHelper.capitalize(type.name),
                })),
                name: StringHelper.replace(StringHelper.capitalize(source.nameSpecies), '-', ' '),
                href: { name: PokegenRouteName.Pokemon, params: { name: source.nameSpecies } },
            }
        } catch (error) {
            this.logger.error("[PokemonViewMapper] - Error during mapping of Pokémon: " + (error as Error).message);
            throw new MappingError<Pokemon>("[PokemonViewMapper] - Error during mapping of Pokémon", source, error as Error);
        }
    }

    /**
     * Mappa un array di entità Pokemon in un PokemonVM.
     * @param source - L'array di entità Pokemon da mappare
     * @returns L'oggetto PokemonVM risultante dalla mappatura
     * @throws MappingError se la mappatura fallisce
     */
    mapDetail(source: Pokemon): PokemonVM {
        this.logger.debug("[PokemonViewMapper] - Inizio della mappatura del dettaglio del Pokémon");
        const pokemon = this.map(source);
        try {
            pokemon.abilities = source.abilities?.map((a) => {
                return {
                    slot: a.isHidden ? 'Hidden' : AbilitySlotMap[a.slot] || 'Unknown',
                    name: StringHelper.capitalize(a.name),
                    isHidden: a.isHidden,
                };
            })
            pokemon.height = MathHelper.formatDecimeterValue(source.height);
            pokemon.weight = MathHelper.formatDecimeterValue(source.weight);
            pokemon.stats = source.stats;
            pokemon.flavorText = source.flavorText;
            pokemon.genus = source.genus;
            const [generation, roman] = StringHelper.splitByHyphen(source.generation || '');

            const label = StringHelper.capitalize(generation);
            const generationId = MathHelper.convertToArabicNumber(roman);
            pokemon.generation = { href: { name: PokegenRouteName.Generation, params: { id: generationId ?? 1 } }, name: `${label} ${roman?.toUpperCase()}` };
            pokemon.genderRate = MathHelper.mapGenderRate(source.genderRate || -1);
            pokemon.captureRate = MathHelper.formatPercentageValue(source.captureRate || 0);
            pokemon.varieties = source.varieties?.map(v => ({
                isDefault: v.is_default,
                pokemon: {
                    name: StringHelper.capitalize(StringHelper.replace(v.pokemon.name, '-',' ')),
                    href: { name: PokegenRouteName.Pokemon, params: { name: v.pokemon.name } },
                    sprite: v.pokemon.sprite || DEFAULT_POKEMON_IMAGE,
                }
            }));
            if (source.evolution)
                pokemon.evolution = this.mapEvolutionToVM(source.evolution, pokemon);

            // TODO: Aggiungere ulteriori dettagli specifici per la vista dettaglio
            this.logger.debug("[PokemonViewMapper] - Mappatura del dettaglio del PokémonVM completata con successo.", pokemon);
            return pokemon;
        } catch (error) {
            this.logger.error("[PokemonViewMapper] - Error during mapping detail of Pokémon: " + (error as Error).message);
            throw new MappingError<Pokemon>("[PokemonViewMapper] - Error during mapping detail of Pokémon", source, error as Error);
        }
    }

    /**
     * Mappa le evoluzioni del Pokémon in ViewModel.
     * @param evolutions - Le evoluzioni del Pokémon da mappare
     * @returns L'array di PokemonEvolutionVM risultante dalla mappatura
     * @throws MappingError se la mappatura fallisce
     */
    private mapEvolutionToVM(evolutions: PokemonEvolution[], pokemon: PokemonVM): EvolutionStageVM[] {
        this.logger.debug("[PokemonViewMapper] - Inizio della mappatura dell'evoluzione del pokemon");
        if(!evolutions || evolutions?.length === 0) {
            this.logger.warn("[PokemonViewMapper] - Nessuna evoluzione trovata per il pokemon. Eseguo mappatura fallback.");
            return [{
                pokemons: buildPokemonVM(pokemon.name, pokemon.sprite),
                evolutions: []
            }];
        }

        const stageMap: Record<string, EvolutionStageVM> = {};
        for (const evo of evolutions) {
            if (!stageMap[evo.from]) {
                // nuovo stage
                stageMap[evo.from] = {
                    pokemons: buildPokemonVM(evo.from, evo.spriteFrom ?? DEFAULT_POKEMON_IMAGE),
                    evolutions: []
                };
            }
            stageMap[evo.from].evolutions!.push(buildEvolutionVM(evo));
        }

        return Object.values(stageMap);
    }
}
