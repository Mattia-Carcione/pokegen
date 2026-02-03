/**
 * Rappresenta un moltiplicatore di tipo per l'efficacia dei tipi.
 */
export interface TypeMultiplierVM {
  name: string;
  label: string;
  multiplier: number;
  multiplierLabel: string;
  color: string;
  icon: string;
}

/**
 * Rappresenta l'efficacia dei tipi.
 */
export interface TypeEffectivenessVM {
  defense: {
    weak: TypeMultiplierVM[];
    resist: TypeMultiplierVM[];
    immune: TypeMultiplierVM[];
    normal: TypeMultiplierVM[];
  };
  offense: {
    strong: TypeMultiplierVM[];
    weak: TypeMultiplierVM[];
    noEffect: TypeMultiplierVM[];
    normal: TypeMultiplierVM[];
  };
}
