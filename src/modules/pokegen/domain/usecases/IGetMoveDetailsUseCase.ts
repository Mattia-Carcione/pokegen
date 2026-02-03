import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";

export interface IGetMoveDetailsUseCase extends IUseCaseBase<MoveDetail[]> { }
