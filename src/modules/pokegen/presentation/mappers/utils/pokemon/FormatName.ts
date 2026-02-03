import { StringHelper } from "@/core/utils/string/StringHelper";

export const formatDisplayName = (value: string): string => {
  if (!value) return "";
  return StringHelper.capitalize(StringHelper.replace(value, "-", " "));
};
