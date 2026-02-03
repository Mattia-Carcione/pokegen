import { IRepository } from "@/core/contracts/data/IRepository";
import { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";

export interface IMoveRepository extends IRepository<MoveDetail> { }
