import { MappingError } from "@/core/errors/MappingError";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonViewMapper } from "./contracts/IPokemonViewMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MathHelper } from "@/core/utils/math/MathHelper";
import { PokemonVM } from "../viewmodels/types/PokemonVM";
import { mapPokemonBaseVM } from "@/modules/pokegen/presentation/mappers/utils/pokemon/MapPokemonBaseVM";
import { mapPokemonAbilitiesVM } from "@/modules/pokegen/presentation/mappers/utils/pokemon/MapPokemonAbilitiesVM";
import { mapPokemonGenerationVM } from "@/modules/pokegen/presentation/mappers/utils/pokemon/MapPokemonGenerationVM";
import { mapPokemonVarietiesVM } from "@/modules/pokegen/presentation/mappers/utils/pokemon/MapPokemonVarietiesVM";
import { mapPokemonMovesVM } from "@/modules/pokegen/presentation/mappers/utils/pokemon/MapPokemonMovesVM";
import { mapPokemonSizeVM } from "@/modules/pokegen/presentation/mappers/utils/pokemon/MapPokemonSizeVM";
import { mapEvolutionToVM } from "@/modules/pokegen/presentation/mappers/utils/evolution/MapEvolutionToVM";

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
            return mapPokemonBaseVM(source);
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
            pokemon.abilities = mapPokemonAbilitiesVM(source);
            const { height, weight } = mapPokemonSizeVM(source);
            pokemon.height = height;
            pokemon.weight = weight;
            pokemon.stats = source.stats;
            pokemon.flavorText = source.flavorText;
            pokemon.genus = source.genus;
            pokemon.generation = mapPokemonGenerationVM(source);
            pokemon.genderRate = MathHelper.mapGenderRate(source.genderRate || -1);
            pokemon.captureRate = MathHelper.formatPercentageValue(source.captureRate || 0);
            pokemon.varieties = mapPokemonVarietiesVM(source);
            pokemon.moves = mapPokemonMovesVM(source);
            if (!source.evolution || source.evolution.length === 0) {
                this.logger.warn("[PokemonViewMapper] - Nessuna evoluzione trovata per il pokemon. Eseguo mappatura fallback.");
            }
            pokemon.evolution = mapEvolutionToVM(source.evolution, pokemon);

            // TODO: Aggiungere ulteriori dettagli specifici per la vista dettaglio
            this.logger.debug("[PokemonViewMapper] - Mappatura del dettaglio del PokémonVM completata con successo.", pokemon);
            return pokemon;
        } catch (error) {
            this.logger.error("[PokemonViewMapper] - Error during mapping detail of Pokémon: " + (error as Error).message);
            throw new MappingError<Pokemon>("[PokemonViewMapper] - Error during mapping detail of Pokémon", source, error as Error);
        }
    }

}
