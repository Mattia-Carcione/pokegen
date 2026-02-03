import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { VersionGroupInfo } from "@/modules/pokegen/domain/entities/VersionGroupInfo";

/**
 * Interfaccia per il caso d'uso di recupero della lista dettagliata dei version-group.
 */
export interface IGetVersionGroupsDetailUseCase extends IUseCaseBase<VersionGroupInfo[]> { }
