import chroma from 'chroma-js';

type RGBColor = [number, number, number];

export class ColorGenerator {
  /**
   * Возвращает противоположный цвет для заданного HEX-цвета.
   *
   * @param hexColor Исходный HEX-цвет (#RRGGBB).
   * @returns Противоположный HEX-цвет.
   */
  private MAX_ATTEMPTS = 10;
  private colors: Set<string>; // Набор существующих цветов

  constructor() {
    this.colors = new Set();
  }

  static contrastHex(hexColor: string): string {
    // Преобразуем HEX в RGB
    const rgb = this.hexToRgb(hexColor);
    // Рассчитываем противоположный цвет
    const oppositeRGB: RGBColor = [
      Math.abs(rgb[0] - 255),
      Math.abs(rgb[1] - 255),
      Math.abs(rgb[2] - 255)
    ];
    // Преобразуем обратно в HEX
    return this.rgbToHex(oppositeRGB);
  }

  /**
   * Преобразует HEX-строку в массив RGB.
   *
   * @param hex HEX-строка (#RRGGBB).
   * @returns Массив RGB.
   */
  private static hexToRgb(hex: string): RGBColor {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  /**
   * Преобразует массив RGB в HEX-строку.
   *
   * @param rgb RGB-массив.
   * @returns HEX-строка (#RRGGBB).
   */
  private static rgbToHex([r, g, b]: RGBColor): string {
    return '#' +
      ('0' + r.toString(16)).slice(-2) +
      ('0' + g.toString(16)).slice(-2) +
      ('0' + b.toString(16)).slice(-2);
  }

     /**
   * Создает новый уникальный контрастный цвет.
   *
   * @returns Уникальный HEX-цвет, контрастный по отношению к предыдущим.
   */
  generateUniqueContrastColor(): string {
    let attempts = 0;
    while (attempts < this.MAX_ATTEMPTS) {
      const randomColor = this.generateRandomHex(); // Случайный цвет
      if (!this.isSimilar(randomColor)) { // Проверяем, насколько уникален новый цвет
        this.colors.add(randomColor); // Сохраняем новый цвет
        return randomColor;
      }
      attempts++;
    }
  }

  /**
   * Проверяет, достаточно ли новоиспечённый цвет контрастен по отношению к остальным.
   *
   * @param hex Новый потенциальный цвет.
   * @returns true, если цвет отличается от остальных; false иначе.
   */
  private isSimilar(hex: string): boolean {
    const newChromaColor = chroma(hex);
    for (const existing of this.colors.values()) {
      const existingChromaColor = chroma(existing);
      // eslint-disable-next-line import/no-named-as-default-member
      const deltaE =  chroma.deltaE(newChromaColor, existingChromaColor); // Оцениваем разницу CIEDE2000
      if (deltaE < 10) { // Число можно регулировать для большей/слабой контрастности
        return true; // Слишком похожий цвет найден
      }
    }
    return false;
  }

  /**
   * Генерирует случайный HEX-цвет.
   *
   * @returns Случайный HEX-цвет.
   */
  private generateRandomHex(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  /**
   * Получаем количество уникальных цветов, созданных генератором.
   *
   * @returns Количество уникальных цветов.
   */
  getCountOfColors(): number {
    return this.colors.size;
  }

  /**
   * Список всех созданных цветов.
   *
   * @returns Массив HEX-цветов.
   */
  getAllGeneratedColors(): string[] {
    return Array.from(this.colors);
  }
}

// Пример использования:
console.log(ColorGenerator.contrastHex('#FF0000')); // "#00FFFF"
console.log(ColorGenerator.contrastHex('#FFFFFF')); // "#000000"
console.log(ColorGenerator.contrastHex('#000000')); // "#FFFFFF"