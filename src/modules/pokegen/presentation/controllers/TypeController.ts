import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { Type } from "../../domain/entities/Type";

export class TypeController implements IUseControllerBase {
    constructor(
        private readonly loadAllUseCase: IUseCaseBase<Type[]>,
        private readonly loadByIdUseCase: IUseCaseBase<Type>
    ) { }

    async loadData(input?: string) {
        if (input) {
            return this.loadByIdUseCase.execute(input);
        }
        return this.loadAllUseCase.execute();
    }
}
