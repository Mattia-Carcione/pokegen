/**
 * Classe di utilità per operazioni matematiche.
 */
export class MathHelper {
  private constructor() { }

  /**
   * Converte un valore numerico in una percentuale formattata a due cifre decimali.
   * @param num - Il valore numerico da convertire.
   * @returns Il valore convertito in percentuale, con due cifre decimali.
   */
  static formatPercentageValue(num: number): number {
    return Number(((num / 255) * 100).toFixed(2));
  }

  /**
   * Converte un valore in decimetri a metri, formattato a due cifre decimali.
   * @param value - Il valore in decimetri da convertire.
   * @returns Il valore convertito in metri, con due cifre decimali.
   */
  static formatDecimeterValue(value: number): number {
    return Number((value / 10).toFixed(2));
  }

  /**
   * Converte un numero romano in numero arabo.
   */
  static convertToArabicNumber(roman: string): number {
    if (!roman) return 0;

    roman = roman.toUpperCase();
    const mappaRomana: { [key: string]: number } = {
      'M': 1000,
      'CM': 900,
      'D': 500,
      'CD': 400,
      'C': 100,
      'XC': 90,
      'L': 50,
      'XL': 40,
      'X': 10,
      'IX': 9,
      'V': 5,
      'IV': 4,
      'I': 1
    };
    let i = 0;
    let risultato = 0;
    while (i < roman.length) {
      const dueCaratteri = roman.substring(i, i + 2);
      const unoCarattere = roman.charAt(i);
      if (mappaRomana[dueCaratteri]) {
        risultato += mappaRomana[dueCaratteri];
        i += 2;
      } else {
        risultato += mappaRomana[unoCarattere];
        i += 1;
      }
    }
    return risultato;
  }

  /**
   * Converte un numero arabo in numero romano.
   * Supporta numeri da 1 a 3999.
   */
  static convertToRomanNumber(number: number): string {
    if (number <= 0 || number > 3999) {
      throw new Error("Number out of range (must be between 1 and 3999): " + number);
    }

    // Mappa dei valori romani principali
    const mappaRomana: { [key: number]: string } = {
      1000: 'M',
      900: 'CM',
      500: 'D',
      400: 'CD',
      100: 'C',
      90: 'XC',
      50: 'L',
      40: 'XL',
      10: 'X',
      9: 'IX',
      5: 'V',
      4: 'IV',
      1: 'I'
    };

    let risultato = "";

    // Ordiniamo le chiavi in modo decrescente
    const chiavi = Object.keys(mappaRomana)
      .map(Number)
      .sort((a, b) => b - a);

    for (const valore of chiavi) {
      while (number >= valore) {
        risultato += mappaRomana[valore];
        number -= valore;
      }
    }

    return risultato;
  }

  /**
 * Funzione per mappare il tasso di genere del Pokémon
 * @param genderRate (number) il numero di tasso di genere espresso in ottavi
 */
  static mapGenderRate(genderRate: number): { male: number; female: number; } | undefined {
    if (genderRate < 0) return undefined;
    if (genderRate === 0) return { male: 100, female: 0 }
    if (genderRate > 0) {
      const femaleRate = Number(((genderRate / 8) * 100).toFixed(2));
      const maleRate = Number(100 - femaleRate);
      return { male: maleRate, female: femaleRate }
    }
  }
}
