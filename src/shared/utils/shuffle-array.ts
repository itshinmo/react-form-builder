/**
 * Returns a shuffled copy of `array` (Fisher-Yates). The input is not mutated.
 */
const shuffleArray = <T>(array: readonly T[]): T[] => {
  const result = [...array];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = result[index] as T;

    result[index] = result[randomIndex] as T;
    result[randomIndex] = current;
  }

  return result;
};

export default shuffleArray;
