import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { safeFetch } from "@/core/utils/async/SafeFetch";
import { IMoveDetailsEnricherService } from "@/modules/pokegen/application/services/contracts/IMoveDetailsEnricherService";
import { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";
import { IMachineRepository } from "@/modules/pokegen/domain/repositories/IMachineRepository";

/**
 * Servizio per arricchire le mosse con i numeri macchina per version group.
 */
export class MoveDetailsEnricherService implements IMoveDetailsEnricherService {
  constructor(
    private readonly machineRepository: IMachineRepository,
    private readonly logger: ILogger
  ) {}

  async enrich(moves: MoveDetail[], versionGroups: string[]): Promise<MoveDetail[]> {
    if (!versionGroups.length) return moves;

    this.logger.debug("[MoveDetailsEnricherService] - Arricchimento macchine per " + versionGroups.length + " version groups.");

    const machinePairs = moves.flatMap((move) =>
      (move.machines ?? []).filter((machine) => versionGroups.includes(machine.versionGroup))
    );

    if (!machinePairs.length) return moves;

    const machineUrls = Array.from(new Set(machinePairs.map((m) => m.machineUrl)));
    const machineResults = await Promise.all(
      machineUrls.map((url) => safeFetch(this.machineRepository.getAsync.bind(this.machineRepository), url))
    );

    const machineMap = new Map<string, string | null>();
    machineResults.forEach((machine) => {
      if (!machine) return;
      machineMap.set(machine.machineUrl, machine.machineNumber);
    });

    return moves.map((move) => {
      if (!move.machines?.length) return move;

      const machineNumbers: Record<string, string> = {};
      move.machines.forEach((machine) => {
        if (!versionGroups.includes(machine.versionGroup)) return;
        const value = machineMap.get(machine.machineUrl) ?? null;
        if (value) machineNumbers[machine.versionGroup] = value;
      });

      return new MoveDetail(
        move.name,
        move.type,
        move.damageClass,
        move.power,
        move.accuracy,
        move.pp,
        move.machines,
        Object.keys(machineNumbers).length ? machineNumbers : undefined
      );
    });
  }
}
