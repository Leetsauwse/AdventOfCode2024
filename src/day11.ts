import { readInputLines } from "@utils/file_utils.ts";

interface StonePattern {
  multiplier: bigint;  // How many stones follow this pattern
  value: string;       // The current value
}

function normalizeNumber(num: string): string {
  return num.replace(/^0+/, '') || '0';
}

function processPattern(pattern: StonePattern): StonePattern[] {
  const { value } = pattern;
  
  // Rule 1: Zero becomes one
  if (value === "0") {
    return [{
      multiplier: pattern.multiplier,
      value: "1"
    }];
  }
  
  // Rule 2: Even number of digits splits
  if (value.length % 2 === 0) {
    const mid = Math.floor(value.length / 2);
    const left = normalizeNumber(value.slice(0, mid));
    const right = normalizeNumber(value.slice(mid));
    return [{
      multiplier: pattern.multiplier,
      value: left
    }, {
      multiplier: pattern.multiplier,
      value: right
    }];
  }
  
  // Rule 3: Multiply by 2024
  return [{
    multiplier: pattern.multiplier,
    value: (BigInt(value) * 2024n).toString()
  }];
}

function mergePatterns(patterns: StonePattern[]): StonePattern[] {
  const merged = new Map<string, bigint>();
  
  for (const pattern of patterns) {
    const current = merged.get(pattern.value) || 0n;
    merged.set(pattern.value, current + pattern.multiplier);
  }
  
  return Array.from(merged.entries()).map(([value, multiplier]) => ({
    value,
    multiplier
  }));
}

function simulateBlinks(initialStones: string[], numBlinks: number): bigint {
  // Convert initial stones to patterns
  let patterns = initialStones.map(value => ({
    multiplier: 1n,
    value
  }));
  
  for (let blink = 1; blink <= numBlinks; blink++) {
    // Process each pattern and get new patterns
    const newPatterns: StonePattern[] = [];
    for (const pattern of patterns) {
      newPatterns.push(...processPattern(pattern));
    }
    
    // Merge patterns with same values
    patterns = mergePatterns(newPatterns);
    
    if (blink % 5 === 0 || blink === numBlinks) {
      const totalStones = patterns.reduce((sum, p) => sum + p.multiplier, 0n);
      console.log(`Processed ${blink}/${numBlinks} blinks. Current stones: ${totalStones}`);
    }
  }
  
  // Calculate total stones
  return patterns.reduce((sum, pattern) => sum + pattern.multiplier, 0n);
}

async function solve(input: string[]): Promise<string> {
  const stones = input[0].split(" ").map(s => s.trim());
  const result = simulateBlinks(stones, 75);
  return result.toString();
}

if (import.meta.main) {
  const input = await readInputLines(11);
  
  console.time("Total Time");
  const result = await solve(input);
  console.timeEnd("Total Time");
  
  console.log(`\nResult: ${result}`);
}