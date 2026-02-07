// modules/pokegen/presentation/controllers/GenerationController.ts
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { Generation } from "../../domain/entities/Generation";

export class GenerationController implements IUseControllerBase {
    constructor(
        private readonly loadAllUseCase: IUseCaseBase<Generation[]>,
        private readonly loadByIdUseCase: IUseCaseBase<Generation>
    ) { }

    async loadData(input?: string) {
        if (input)
            return this.loadByIdUseCase.execute(input);
        return this.loadAllUseCase.execute();
    }
}
