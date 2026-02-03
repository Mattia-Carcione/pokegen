export class MachineInfo {
  constructor(
    public readonly machineUrl: string,
    public readonly itemName: string,
    public readonly machineNumber: string | null,
  ) {}
}
