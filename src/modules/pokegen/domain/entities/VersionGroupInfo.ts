/**
 * Entity che rappresenta le informazioni dettagliate di un version-group.
 */
export class VersionGroupInfo {
  constructor(
    public readonly name: string,
    public readonly generation: string,
    public readonly versions: string[],
    public readonly regions: string[],
    public readonly moveLearnMethods: string[]
  ) {}
}
