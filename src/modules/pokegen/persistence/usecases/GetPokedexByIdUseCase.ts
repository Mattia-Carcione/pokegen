import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { IRepository } from "@/core/contracts/application/IRepository";
import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { Pokedex } from "@/modules/pokegen/domain/entities/Pokedex";

export class GetPokedexByIdUseCase implements IUseCaseBase<Pokedex> {
    constructor(
        private readonly repository: IRepository<Pokedex>,
        private readonly logger: ILogger
    ) { }

    async execute(id: string): Promise<Result<Pokedex, Error>> {
        this.logger.debug("[GetPokedexByIdUseCase] - Esecuzione del caso d'uso per ottenere un Pokedex.");

        if (!id) {
            const error = new Error("Missing pokedex id");
            this.logger.error("[GetPokedexByIdUseCase] - ID Pokedex mancante.", error);
            return Result.fail<Pokedex, Error>(error);
        }

        try {
            const pokedex = await this.repository.getAsync(id);
            return Result.success<Pokedex, Error>(pokedex);
        } catch (error: any) {
            this.logger.error("[GetPokedexByIdUseCase] - Errore durante l'esecuzione del caso d'uso.", error);
            return Result.fail<Pokedex, Error>(error);
        }
    }
}
