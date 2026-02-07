import { IMapper } from "@/core/contracts/application/IMapper";
import { MappingError } from "@/commons/errors/MappingError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { Pokedex } from "../../domain/entities/Pokedex";
import { PokedexDto } from "../../application/dtos/PokedexDto";

export class PokedexMapper implements IMapper<PokedexDto, Pokedex> {
    constructor(private readonly logger: ILogger) { }

    map(dto: PokedexDto): Pokedex {
        this.logger.debug("[PokedexMapper] - Mapping del DTO del Pokedex in entita.");

        try {
            const description =
                dto.descriptions?.find((item) => item.language?.name === "en")?.description ?? "";

            const pokemon = dto.pokemon_entries?.map((entry) => entry.pokemon_species) ?? [];

            return new Pokedex(
                dto.id,
                dto.name,
                description,
                pokemon,
                dto.region?.name ?? "",
                dto.version_groups ?? []
            );
        } catch (err) {
            this.logger.error("[PokedexMapper] - Errore nel mapping del Pokedex", err);
            throw new MappingError("Errore nel mapping del Pokedex", dto, err as Error);
        }
    }
}
