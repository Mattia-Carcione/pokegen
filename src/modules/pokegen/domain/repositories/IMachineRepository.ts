import { IRepository } from "@/core/contracts/data/IRepository";
import { MachineInfo } from "@/modules/pokegen/domain/entities/MachineInfo";

export interface IMachineRepository extends IRepository<MachineInfo> { }
