import { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";

export interface IMoveDetailsEnricherService {
  enrich(moves: MoveDetail[], versionGroups: string[]): Promise<MoveDetail[]>;
}
