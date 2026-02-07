import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { Pokedex } from "../../domain/entities/Pokedex";

export class PokedexController implements IUseControllerBase {
    constructor(
        private readonly loadAllUseCase: IUseCaseBase<Pokedex[]>,
        private readonly loadByIdUseCase: IUseCaseBase<Pokedex>
    ) { }

    async loadData(input?: string) {
        if (input) {
            return this.loadByIdUseCase.execute(input);
        }
        return this.loadAllUseCase.execute();
    }
}
