export class MoveDetail {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly damageClass: string,
    public readonly power: number | null,
    public readonly accuracy: number | null,
    public readonly pp: number | null,
    public readonly machines: { versionGroup: string; machineUrl: string }[] = [],
    public readonly machineNumbers?: Record<string, string>
  ) {}
}
