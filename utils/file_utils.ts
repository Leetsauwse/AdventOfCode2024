/**
 * Reads puzzle input from a file and returns it as a string
 */
export async function readInput(day: number): Promise<string> {
    const input = await Deno.readTextFile(`./inputs/day${day}.txt`);
    return input.trim();
  }
  
  /**
   * Reads puzzle input from a file and returns it as an array of lines
   */
  export async function readInputLines(day: number): Promise<string[]> {
    const input = await readInput(day);
    return input.split('\n');
  }
  
  /**
   * Reads puzzle input from a file and returns it as an array of numbers
   */
  export async function readInputNumbers(day: number): Promise<number[]> {
    const lines = await readInputLines(day);
    return lines.map(Number);
  }
