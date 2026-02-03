import { MathHelper } from "@/core/utils/math/MathHelper";
import { StringHelper } from "@/core/utils/string/StringHelper";
import { TYPE_COLORS, TYPE_ICONS } from "@/modules/pokegen/presentation/config/PokegenAssets";
import type { MoveDetail } from "@/modules/pokegen/domain/entities/MoveDetail";

export const generationFromVersionGroup = (
  versionGroups: { name: string; generation?: string }[],
  versionGroup: string
): number | null => {
  const group = versionGroups.find((item: { name: string }) => item.name === versionGroup);
  if (!group?.generation) return null;

  const parts = StringHelper.splitByHyphen(group.generation);
  if (parts.length < 2) return null;
  const roman = parts[parts.length - 1];
  const value = MathHelper.convertToArabicNumber(roman);
  return value || null;
};

export const generationLabel = (generation: number | null): string => {
  if (!generation) return "";
  const roman = MathHelper.convertToRomanNumber(generation);
  return `Gen ${roman}`;
};

export const buildTypeBadge = (type: string) => {
  const key = (type || "").toLowerCase();
  return {
    label: StringHelper.capitalize(key),
    icon: TYPE_ICONS[key],
    color: TYPE_COLORS[key] ?? "#9ca3af",
  };
};

export const formatCategory = (value: string) => {
  if (!value) return "-";
  return StringHelper.capitalize(StringHelper.replace(value, "-", " "));
};

export const findMachineNumber = (
  detail: MoveDetail | undefined,
  versionGroupsForGeneration: string[]
): string => {
  if (!detail) return "-";
  if (detail.machineNumbers) {
    for (const group of versionGroupsForGeneration) {
      const value = detail.machineNumbers[group];
      if (value) return value;
    }

    const fallback = Object.values(detail.machineNumbers)[0];
    if (fallback) return fallback;
  }

  const firstMachine = detail.machines?.find((m: { machineUrl: string }) => m.machineUrl)?.machineUrl;
  if (!firstMachine) return "-";
  const match = firstMachine.match(/machine\/(\d+)/i);
  if (match?.[1]) {
    return `TM${match[1].padStart(2, "0")}`;
  }

  return "-";
};

export const powerValue = (detail: MoveDetail | undefined): number =>
  typeof detail?.power === "number" ? detail.power : -1;
