import { randomInt } from "@/lib/utils";

export type ArrayPreset = "random" | "nearly-sorted" | "reversed" | "duplicate-heavy";

export function generateArray(
  size: number,
  preset: ArrayPreset = "random"
): number[] {
  switch (preset) {
    case "random":
      return Array.from({ length: size }, (_, i) => randomInt(1, 100));
    case "nearly-sorted": {
      const arr = Array.from({ length: size }, (_, i) => i + 1);
      for (let i = 0; i < Math.floor(size * 0.1); i++) {
        const a = randomInt(0, size - 1);
        const b = randomInt(0, size - 1);
        [arr[a], arr[b]] = [arr[b], arr[a]];
      }
      return arr;
    }
    case "reversed":
      return Array.from({ length: size }, (_, i) => size - i);
    case "duplicate-heavy": {
      const values = [1, 2, 3, 5, 10, 20, 50];
      return Array.from({ length: size }, () => values[randomInt(0, values.length - 1)]);
    }
    default:
      return Array.from({ length: size }, (_, i) => randomInt(1, 100));
  }
}
