import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { IRepository } from "@/core/contracts/application/IRepository";
import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { Pokedex } from "@/modules/pokegen/domain/entities/Pokedex";

export class GetPokedexUseCase implements IUseCaseBase<Pokedex[]> {
    constructor(
        private readonly repository: IRepository<Pokedex>,
        private readonly logger: ILogger
    ) { }

    async execute(): Promise<Result<Pokedex[], Error>> {
        this.logger.debug("[GetPokedexUseCase] - Esecuzione del caso d'uso per ottenere tutti i pokedex.");

        try {
            const pokedex = await this.repository.getAllAsync();
            return Result.success<Pokedex[], Error>(pokedex);
        } catch (error: any) {
            this.logger.error("[GetPokedexUseCase] - Errore durante l'esecuzione del caso d'uso.", error);
            return Result.fail<Pokedex[], Error>(error);
        }
    }
}
