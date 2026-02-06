import { IMapper } from "@/core/contracts/application/IMapper";
import { MappingError } from "@/commons/errors/MappingError";

import mapJson from '../../assets/generation-pokedex-map.json';

import { Generation } from "../../domain/entities/Generation";
import { GenerationDto } from "../../application/dtos/GenerationDto";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

export class GenerationMapper implements IMapper<GenerationDto, Generation> {
    constructor(private readonly logger: ILogger) { }

    map(dto: GenerationDto): Generation {
        this.logger.debug("[GenerationMapper] - Mapping del DTO della generazione in entità.");
        try {
            const generationMap = mapJson as Record<string, { pokedexId: number }>;
            const pokedexId: number = generationMap[String(dto.id)]?.pokedexId || 0;
            return new Generation(
                dto.id,
                dto.name,
                dto.abilities,
                dto.main_region,
                dto.moves,
                dto.pokemon_species,
                dto.types,
                dto.version_groups,
                pokedexId
            );
        } catch (err) {
            this.logger.error("[GenerationMapper] - Errore nel mapping della generazione", err);
            throw new MappingError("Errore nel mapping della generazione", dto, err as Error);
        }
    }
}
