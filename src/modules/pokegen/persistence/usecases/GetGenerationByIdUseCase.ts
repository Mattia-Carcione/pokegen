import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { IRepository } from "@/core/contracts/application/IRepository";
import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { Generation } from "@/modules/pokegen/domain/entities/Generation";

export class GetGenerationByIdUseCase implements IUseCaseBase<Generation> {
    constructor(
        private readonly repository: IRepository<Generation>,
        private readonly logger: ILogger
    ) { }

    async execute(id: string): Promise<Result<Generation, Error>> {
        this.logger.debug("[GetGenerationByIdUseCase] - Esecuzione del caso d'uso per ottenere una generazione.");
        
        if (!id) {
            const error = new Error("Missing generation id");
            this.logger.error("[GetGenerationByIdUseCase] - ID generazione mancante.", error);
            return Result.fail<Generation, Error>(error);
        }


        try {
            const generation = await this.repository.getAsync(id);
            return Result.success<Generation, Error>(generation);
        } catch (error: any) {
            this.logger.error("[GetGenerationByIdUseCase] - Errore durante l'esecuzione del caso d'uso.", error);
            return Result.fail<Generation, Error>(error);
        }
    }
}
