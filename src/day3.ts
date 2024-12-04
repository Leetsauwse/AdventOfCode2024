import { readInputLines } from "@utils/file_utils.ts";

const DAY = 3;

function parseMultiplications(input: string): RegExpMatchArray | [] {
  const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
  return input.match(pattern) || [];
}

function calculateProduct(mulString: string): number {
  const [, num1, num2] = mulString.match(/mul\((\d{1,3}),(\d{1,3})\)/)!;
  return parseInt(num1) * parseInt(num2);
}

async function part1(input: string[]): Promise<number> {
  const fullText = input.join('\n');
  const matches = parseMultiplications(fullText);
  
  return matches.reduce((total, mulString) => {
    return total + calculateProduct(mulString);
  }, 0);
}

async function part2(input: string[]): Promise<number> {
  const fullText = input.join('\n');
  const pattern = /(?:mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g;
  
  let enabled = true;
  let total = 0;
  
  let match;
  while ((match = pattern.exec(fullText)) !== null) {
    const instruction = match[0];
    
    switch(instruction) {
      case 'do()':
        enabled = true;
        break;
      case "don't()":
        enabled = false;
        break;
      default:
        if (enabled && instruction.startsWith('mul')) {
          const nums = instruction.match(/\d+/g)!;
          const product = parseInt(nums[0], 10) * parseInt(nums[1], 10);
          total += product;
        }
    }
  }
  
  return total;
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
