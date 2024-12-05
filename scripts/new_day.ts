// scripts/new_day.ts
const template = `import { readInput, readInputLines, readInputNumbers } from "@utils/file_utils.ts";

const DAY = {{day}};

async function part1(input: string[]): Promise<number> {
  // Implement part 1 solution
  return 0;
}

async function part2(input: string[]): Promise<number> {
  // Implement part 2 solution
  return 0;
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

// For testing
export { part1, part2 };`;

const day = Deno.args[0] || new Date().getDate().toString();
const filename = `src/day${day}.ts`;

// Create new day file if it doesn't exist
if (!await exists(filename)) {
  await Deno.writeTextFile(
    filename,
    template.replace(/{{day}}/g, day)
  );
  console.log(`Created ${filename}`);
}

async function exists(filename: string): Promise<boolean> {
  try {
    await Deno.stat(filename);
    return true;
  } catch {
    return false;
  }
}
