import { readInputLines } from "@utils/file_utils.ts";

const DAY = 1;

type NumberPair = {
  left: number;
  right: number;
};

function parseInput(input: string[]): NumberPair[] {
  return input.map(line => {
    const [left, right] = line.split(/\s+/).map(Number);
    return { left, right };
  });
}

async function part1(input: string[]): Promise<number> {
  const pairs = parseInput(input);
  const leftArray = pairs.map(p => p.left);
  const rightArray = pairs.map(p => p.right);
  
  const sortedLeft = [...leftArray].sort((a, b) => a - b);
  const sortedRight = [...rightArray].sort((a, b) => a - b);
  
  let totalDistance = 0;
  for (let i = 0; i < sortedLeft.length; i++) {
    totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
  }
  
  return totalDistance;
}

async function part2(input: string[]): Promise<number> {
  const pairs = parseInput(input);
  const leftArray = pairs.map(p => p.left);
  const rightArray = pairs.map(p => p.right);
  
  const sortedLeft = [...leftArray].sort((a, b) => a - b);
  const sortedRight = [...rightArray].sort((a, b) => a - b);
  
  const frequencyMap: Record<number, number> = {};
  sortedRight.forEach(num => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
  });
  
  let similarityScore = 0;
  sortedLeft.forEach(num => {
    const frequency = frequencyMap[num] || 0;
    similarityScore += num * frequency;
  });
  
  return similarityScore;
}

if (import.meta.main) {
  const input = await readInputLines(DAY);
  
  console.time("Part 1");
  const part1Result = await part1(input);
  console.timeEnd("Part 1");
  console.log("Part 1:", part1Result);
  
  console.time("Part 2");
  const part2Result = await part2(input);
  console.timeEnd("Part 2");
  console.log("Part 2:", part2Result);
}
