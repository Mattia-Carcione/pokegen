import { computed, ref, unref, watch, type ComputedRef, type Ref } from "vue";
import { appContainer } from "@/app/di/AppContainer";
import type { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";
import {
  buildTypeBadge,
  findMachineNumber,
  formatCategory,
  generationFromVersionGroup,
  generationLabel,
  powerValue,
} from "@/modules/pokegen/presentation/composables/utils/movesInfoHelpers";

interface MoveLearnDetailVM {
  level: number;
  method: string;
  versionGroup: string;
}

interface MoveVM {
  name: string;
  slug: string;
  details: MoveLearnDetailVM[];
}

interface VersionGroupInfoVM {
  name: string;
  generation?: string;
}

interface LevelUpMoveVM {
  name: string;
  slug: string;
  level: number;
  detail?: MoveDetail;
}

interface OtherMoveVM {
  name: string;
  slug: string;
  method: string;
  detail?: MoveDetail;
}

export const useMovesInfo = (movesSource: Ref<MoveVM[]> | ComputedRef<MoveVM[]> | MoveVM[]) => {
  const moves = computed(() => (unref(movesSource) ?? []) as MoveVM[]);

  const versionGroupsController = appContainer.versionGroupsController() as unknown as { list: { value: VersionGroupInfoVM[] | null } };
  const versionGroups = computed(() => (versionGroupsController.list.value ?? []) as VersionGroupInfoVM[]);
  const moveDetailsController = appContainer.moveDetailsController() as unknown as { details: { value: Record<string, MoveDetail> | null }, loadData: (input: { names: string[]; versionGroups?: string[] }) => Promise<void> };
  const moveDetails = computed(() => (moveDetailsController.details.value ?? {}) as Record<string, MoveDetail>);

  const resolveGeneration = (versionGroup: string) => generationFromVersionGroup(versionGroups.value, versionGroup);

  const availableGenerations = computed(() => {
    const gens = new Set<number>();
    moves.value.forEach((move) => {
      move.details.forEach((detail) => {
        const gen = resolveGeneration(detail.versionGroup);
        if (gen) gens.add(gen);
      });
    });

    return Array.from(gens).sort((a, b) => a - b);
  });

  const selectedGeneration = ref<number | null>(null);

  watch(availableGenerations, (gens) => {
    if (!gens?.length) {
      selectedGeneration.value = null;
      return;
    }
    if (!selectedGeneration.value || !gens.includes(selectedGeneration.value)) {
      selectedGeneration.value = gens[gens?.length - 1];
    }
  }, { immediate: true });

  const detailsForGeneration = computed(() => {
    if (!selectedGeneration.value) return [];

    return moves.value
      .map((move) => {
        const details = move.details.filter((detail) => {
          const gen = resolveGeneration(detail.versionGroup);
          return gen === selectedGeneration.value;
        });
        return { name: move.name, slug: move.slug, details };
      })
      .filter((move) => move.details?.length > 0);
  });

  const versionGroupsForGeneration = computed(() => {
    if (!selectedGeneration.value) return [];
    return versionGroups.value
      .filter((group) => resolveGeneration(group.name) === selectedGeneration.value)
      .map((group) => group.name);
  });

  watch(
    [detailsForGeneration, versionGroupsForGeneration],
    async ([movesForGen, groupNames]) => {
      const names = movesForGen.map((move) => move.slug);
      if (!names?.length) return;
      await moveDetailsController.loadData({ names, versionGroups: groupNames });
    },
    { immediate: true }
  );

  const getMachineNumber = (detail: MoveDetail | undefined) =>
    findMachineNumber(detail, versionGroupsForGeneration.value);

  const levelUpMoves = computed(() => {
    return detailsForGeneration.value
      .map<LevelUpMoveVM | null>((move) => {
        const levels = move.details
          .filter((d) => d.method === "level-up")
          .map((d) => d.level)
          .filter((l) => l > 0);
        if (!levels?.length) return null;
        const minLevel = Math.min(...levels);
        const detail = moveDetails.value[move.slug] as MoveDetail | undefined;
        return {
          name: move.name,
          slug: move.slug,
          level: minLevel,
          detail,
        };
      })
      .filter((item): item is LevelUpMoveVM => item !== null)
      .sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        const powerDiff = powerValue(b.detail) - powerValue(a.detail);
        if (powerDiff !== 0) return powerDiff;
        return a.name.localeCompare(b.name);
      });
  });

  const machineMoves = computed(() => {
    return detailsForGeneration.value
      .filter((move) => move.details.some((d) => d.method === "machine"))
      .map((move) => {
        const detail = moveDetails.value[move.slug];
        return {
          name: move.name,
          slug: move.slug,
          machine: getMachineNumber(detail),
          detail,
        };
      })
      .sort((a, b) => {
        const powerDiff = powerValue(b.detail) - powerValue(a.detail);
        if (powerDiff !== 0) return powerDiff;
        return a.name.localeCompare(b.name);
      });
  });

  const eggAndEvoMoves = computed(() => {
    return detailsForGeneration.value
      .map<OtherMoveVM | null>((move) => {
        const methods = Array.from(new Set(
          move.details
            .filter((d) => d.method !== "level-up" && d.method !== "machine")
            .map((d) => d.method)
        ));
        if (!methods?.length) return null;
        const detail = moveDetails.value[move.slug] as MoveDetail | undefined;
        const methodLabel = methods?.length === 1
          ? formatCategory(methods[0])
          : "Various";

        return {
          name: move.name,
          slug: move.slug,
          method: methodLabel,
          detail,
        };
      })
      .filter((item): item is OtherMoveVM => item !== null)
      .sort((a, b) => {
        const powerDiff = powerValue(b.detail) - powerValue(a.detail);
        if (powerDiff !== 0) return powerDiff;
        return a.name.localeCompare(b.name);
      });
  });

  return {
    availableGenerations,
    selectedGeneration,
    generationLabel,
    levelUpMoves,
    machineMoves,
    eggAndEvoMoves,
    buildTypeBadge,
    formatCategory,
  };
};
