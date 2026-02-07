import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { IRepository } from "@/core/contracts/application/IRepository";
import { Result } from "@/core/domain/entities/Result";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

import { Type } from "@/modules/pokegen/domain/entities/Type";

export class GetTypeByIdUseCase implements IUseCaseBase<Type> {
    constructor(
        private readonly repository: IRepository<Type>,
        private readonly logger: ILogger
    ) { }

    async execute(id: string): Promise<Result<Type, Error>> {
        this.logger.debug("[GetTypeByIdUseCase] - Esecuzione del caso d'uso per ottenere un type.");

        if (!id) {
            const error = new Error("Missing type id");
            this.logger.error("[GetTypeByIdUseCase] - ID type mancante.", error);
            return Result.fail<Type, Error>(error);
        }

        try {
            const type = await this.repository.getAsync(id);
            return Result.success<Type, Error>(type);
        } catch (error: any) {
            this.logger.error("[GetTypeByIdUseCase] - Errore durante l'esecuzione del caso d'uso.", error);
            return Result.fail<Type, Error>(error);
        }
    }
}
