export interface TypeMultiplier {
  name: string;
  multiplier: number;
}

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
