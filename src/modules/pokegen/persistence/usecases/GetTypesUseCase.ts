import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { IRepository } from "@/core/contracts/application/IRepository";
import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { Type } from "@/modules/pokegen/domain/entities/Type";

export class GetTypesUseCase implements IUseCaseBase<Type[]> {
    constructor(
        private readonly repository: IRepository<Type>,
        private readonly logger: ILogger
    ) { }

    async execute(): Promise<Result<Type[], Error>> {
        this.logger.debug("[GetTypesUseCase] - Esecuzione del caso d'uso per ottenere tutti i type.");

        try {
            const types = await this.repository.getAllAsync();
            return Result.success<Type[], Error>(types);
        } catch (error: any) {
            this.logger.error("[GetTypesUseCase] - Errore durante l'esecuzione del caso d'uso.", error);
            return Result.fail<Type[], Error>(error);
        }
    }
}
