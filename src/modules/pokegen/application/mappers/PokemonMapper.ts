import { Pokemon } from "../../domain/entities/Pokemon";
import { MappingError } from "@/core/errors/MappingError";
import { IPokemonMapper } from "@/modules/pokegen/application/mappers/contracts/IPokemonMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokemonAggregateData } from "../../data/models/types/PokemonAggregateData";
import { PokemonDto } from "../../data/models/dtos/PokemonDto";
import { PokemonSpeciesDto } from "../../data/models/dtos/PokemonSpeciesDto";
import { EvolutionChainDto } from "../../data/models/dtos/EvolutionChainDto";
import { PokemonEvolution } from "../../domain/types/PokemonEvolution";
import { traverse } from "./utils/Traverse";
import { StringHelper } from "@/core/utils/string/StringHelper";

/**
 * Mapper per convertire i dati del Pokémon dal Dto al dominio.
 */
export class PokemonMapper implements IPokemonMapper {
    constructor(private readonly logger: ILogger) { }

    /**
     * Converte un oggetto PokemonDto in un'entità Pokemon del dominio.
     * @param Dto - L'oggetto PokemonDto da convertire.
     * @returns L'entità Pokemon corrispondente.
     */
    map(Dto: PokemonAggregateData): Pokemon {
        this.logger.debug("[PokemonMapper] - Inizio della mappatura del Pokémon con ID: " + Dto.pokemon.id);

        const { pokemon, species, evolution, forms } = Dto;

        if (!pokemon.id || !pokemon.name || !pokemon.types || !pokemon.sprites || !pokemon.weight || !pokemon.height || !pokemon.stats)
            throw new MappingError<PokemonDto>("[PokemonMapper] - Error during Pokémon mapping: Missing required properties.", pokemon);

        try {
            const types = pokemon.types.map(t => ({ slot: t.slot, name: t.type.name, url: t.type.url }));

            const entity = new Pokemon(
                pokemon.id,
                pokemon.species.name,
                pokemon.name,
                types.sort((a, b) => a.slot - b.slot),
                pokemon.height,
                pokemon.weight,
                pokemon.stats.map(s => ({ name: s.stat.name, base: s.base_stat })),
                pokemon.sprites.other?.home.front_default ?? pokemon.sprites.front_default ?? ""
            );

            entity.abilities = pokemon.abilities
                .map(a => ({
                    slot: a.slot,
                    name: a.ability.name,
                    isHidden: a.is_hidden,
                }))
                .sort((a, b) => a.slot - b.slot);

            entity.moves = (pokemon.moves ?? []).map((move) => ({
                slug: move.move.name,
                name: move.move.name,
                details: (move.version_group_details ?? []).map((detail) => ({
                    level: detail.level_learned_at,
                    method: detail.move_learn_method.name,
                    versionGroup: detail.version_group.name,
                }))
            }));

            this.mapSpecies(entity, species);

            this.mapEvolution(entity, evolution);

            if (forms) { }

            this.logger.debug("[PokemonMapper] - Mappatura completata con successo. ", entity);
            return entity;
        } catch (error) {
            throw new MappingError<PokemonAggregateData>("[PokemonMapper] - Error during Pokémon mapping", Dto, error as Error);
        }
    }

    /**
     * Mappa i dati della specie del Pokémon nell'entità Pokemon.
     * @param pokemon  L'entità Pokemon da aggiornare.
     * @param Dto I dati della specie del Pokémon.
     * @returns L'entità Pokemon aggiornata con i dati della specie.
     */
    private mapSpecies(pokemon: Pokemon, dto?: PokemonSpeciesDto): Pokemon {
        this.logger.debug("[PokemonMapper] - Inizio della mappatura della specie del Pokémon con ID: " + pokemon.id);
        
        if(!dto) return pokemon;
        if (dto.capture_rate === undefined || !dto.genera || !dto.generation || !dto.flavor_text_entries)
            throw new MappingError<PokemonSpeciesDto>("[PokemonMapper] - Error during Pokémon Species mapping: Missing required properties.");

        pokemon.genus = dto.genera.find((g: any) => g.language.name === "en")?.genus || "";
        pokemon.flavorText = dto.flavor_text_entries
            .filter((entry) => entry.language.name === "en")
            .map((entry) => ({
                version: StringHelper.replace(entry.version.name, '-',' '),
                text: entry.flavor_text.replace(/[\n\f]/g, " ")
            }));
        pokemon.captureRate = dto.capture_rate;
        pokemon.generation = dto.generation.name;
        pokemon.genderRate = dto.gender_rate;
        pokemon.varieties = dto.varieties;
        return pokemon;
    }

    /**
     * Mappa la catena evolutiva del Pokémon nell'entità Pokemon.
     * @param pokemon L'entità Pokemon da aggiornare.
     * @param evolution I dati della catena evolutiva del Pokémon.
     * @returns L'entità Pokemon aggiornata con i dati della catena evolutiva.
     */
    private mapEvolution(pokemon: Pokemon, evolution?: EvolutionChainDto): Pokemon {
        this.logger.debug("[PokemonMapper] - Inizio della mappatura della catena evolutiva del Pokémon con ID: " + pokemon.id);
        
        if(!evolution) return pokemon;
        if(!evolution.chain) 
            throw new MappingError<EvolutionChainDto>("[PokemonMapper] - Error during Pokémon evolution mapping: Missing required properties.");

        const evolutionMap: Map<string, PokemonEvolution> = new Map<string, PokemonEvolution>();
        const traverseMap = traverse(evolution.chain, evolutionMap);
        pokemon.evolution = Array.from(traverseMap.values());
        return pokemon;
    }
}

