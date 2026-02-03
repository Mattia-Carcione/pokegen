/**
 * Rappresenta un moltiplicatore di tipo per l'efficacia dei tipi.
 */
export interface TypeMultiplier {
  name: string;
  multiplier: number;
}

/**
 * Rappresenta l'efficacia dei tipi.
 */
export interface TypeEffectiveness {
  defense: {
    weak: TypeMultiplier[];
    resist: TypeMultiplier[];
    immune: TypeMultiplier[];
    normal: TypeMultiplier[];
  };
  offense: {
    strong: TypeMultiplier[];
    weak: TypeMultiplier[];
    noEffect: TypeMultiplier[];
    normal: TypeMultiplier[];
  };
}
