import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { IRepository } from "@/core/contracts/application/IRepository";
import { Result } from "@/core/domain/entities/Result";

import { Generation } from "@/modules/pokegen/domain/entities/Generation";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

export class GetGenerationsUseCase implements IUseCaseBase<Generation[]> {
    constructor(
        private readonly repository: IRepository<Generation>,
        private readonly logger: ILogger
    ) { }

    async execute(): Promise<Result<Generation[], Error>> {
        this.logger.debug("[GetGenerationsUseCase] - Esecuzione del caso d'uso per ottenere tutte le generazioni.");
        try {
            const generations = await this.repository.getAllAsync();
            return Result.success<Generation[], Error>(generations);
        } catch (error: any) {
            this.logger.error("[GetGenerationsUseCase] - Errore durante l'esecuzione del caso d'uso per ottenere tutte le generazioni.", error);
            return Result.fail<Generation[], Error>(error);
        }
    }
}
