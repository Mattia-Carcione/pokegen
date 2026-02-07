import { IMapper } from "@/core/contracts/application/IMapper";
import { MappingError } from "@/commons/errors/MappingError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { Type, TypeDamageRelations, TypePokemonEntry } from "../../domain/entities/Type";
import { TypeDto } from "../../application/dtos/TypeDto";

export class TypeMapper implements IMapper<TypeDto, Type> {
    constructor(private readonly logger: ILogger) { }

    map(dto: TypeDto): Type {
        this.logger.debug("[TypeMapper] - Mapping del DTO del Type in entita.");

        try {
            const relations = dto.damage_relations;
            const damageRelations: TypeDamageRelations = {
                doubleDamageFrom: relations?.double_damage_from ?? [],
                doubleDamageTo: relations?.double_damage_to ?? [],
                halfDamageFrom: relations?.half_damage_from ?? [],
                halfDamageTo: relations?.half_damage_to ?? [],
                noDamageFrom: relations?.no_damage_from ?? [],
                noDamageTo: relations?.no_damage_to ?? [],
            };

            const pokemon: TypePokemonEntry[] = dto.pokemon?.map((entry) => ({
                slot: entry.slot,
                pokemon: entry.pokemon,
            })) ?? [];

            return new Type(
                dto.id,
                dto.name,
                dto.move_damage_class ?? { name: "", url: "" },
                dto.moves ?? [],
                damageRelations,
                pokemon
            );
        } catch (err) {
            this.logger.error("[TypeMapper] - Errore nel mapping del Type", err);
            throw new MappingError("Errore nel mapping del Type", dto, err as Error);
        }
    }
}
