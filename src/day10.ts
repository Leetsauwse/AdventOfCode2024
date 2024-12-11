import { readInputLines } from "@utils/file_utils.ts";

// Configuration
const CONFIG = {
  VISUALIZE: false,  // Set to true to enable visualization
  SLEEP_TIME: {
    STEP: 50,        // Milliseconds between path exploration steps
    TRAILHEAD: 500   // Milliseconds between trailheads
  }
} as const;

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m"
};

type Point = [number, number];
type Grid = number[][];
type Path = string[];

function sleep(ms: number): Promise<void> {
  if (!CONFIG.VISUALIZE) return Promise.resolve();
  return new Promise(resolve => setTimeout(resolve, ms));
}

function visualizeGrid(
  grid: Grid,
  currentPath: Set<string>,
  validPaths: Set<string>,
  trailhead: Point,
  highlights: Set<string>,
  message: string,
  stats: string
) {
  if (!CONFIG.VISUALIZE) return;
  
  console.clear();
  console.log("\n" + colors.cyan + message + colors.reset);
  
  const lines: string[] = [];
  for (let y = 0; y < grid.length; y++) {
    let line = "";
    for (let x = 0; x < grid[y].length; x++) {
      const pos = `${x},${y}`;
      const cell = grid[y][x];
      
      if (x === trailhead[0] && y === trailhead[1]) {
        // Trailhead
        line += colors.green + colors.bright + cell + colors.reset + " ";
      } else if (currentPath.has(pos)) {
        // Current exploring path
        line += colors.bgBlue + colors.bright + cell + colors.reset + " ";
      } else if (validPaths.has(pos)) {
        // Previously found valid path
        line += colors.blue + colors.bright + cell + colors.reset + " ";
      } else if (highlights.has(pos)) {
        // Highlighted positions (peaks for part 1, path ends for part 2)
        line += colors.magenta + colors.bright + cell + colors.reset + " ";
      } else {
        // Normal cell
        line += colors.dim + cell + colors.reset + " ";
      }
    }
    lines.push(line);
  }
  
  console.log(colors.dim + "─".repeat(grid[0].length * 2) + colors.reset);
  lines.forEach(line => console.log(line));
  console.log(colors.dim + "─".repeat(grid[0].length * 2) + colors.reset);
  console.log(`${colors.yellow}${stats}${colors.reset}`);
}

function findTrailheads(grid: Grid): Point[] {
  const trailheads: Point[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) {
        trailheads.push([x, y]);
      }
    }
  }
  return trailheads;
}

// Part 1: Find reachable peaks
async function exploreTrailsPart1(
  grid: Grid,
  start: Point,
  currentHeight: number,
  currentPath: Set<string>,
  validPaths: Set<string>,
  reachableNines: Set<string>,
): Promise<void> {
  const [x, y] = start;
  const pos = `${x},${y}`;
  
  // Base cases
  if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) return;
  if (currentPath.has(pos)) return;
  if (grid[y][x] !== currentHeight) return;
  
  currentPath.add(pos);
  validPaths.add(pos);
  
  // If we reached a 9, mark it as reachable
  if (grid[y][x] === 9) {
    reachableNines.add(pos);
  }
  
  await sleep(CONFIG.SLEEP_TIME.STEP);
  visualizeGrid(
    grid, 
    currentPath, 
    validPaths, 
    start, 
    reachableNines,
    `Part 1 - Exploring from (${start[0]},${start[1]}) - Current height: ${currentHeight}`,
    `Reachable peaks: ${reachableNines.size}`
  );
  
  // Only continue if we haven't reached 9
  if (currentHeight < 9) {
    const nextHeight = currentHeight + 1;
    // Try all four directions
    await exploreTrailsPart1(grid, [x, y-1], nextHeight, currentPath, validPaths, reachableNines);
    await exploreTrailsPart1(grid, [x+1, y], nextHeight, currentPath, validPaths, reachableNines);
    await exploreTrailsPart1(grid, [x, y+1], nextHeight, currentPath, validPaths, reachableNines);
    await exploreTrailsPart1(grid, [x-1, y], nextHeight, currentPath, validPaths, reachableNines);
  }
  
  currentPath.delete(pos);
}

// Part 2: Count distinct paths
async function exploreTrailsPart2(
  grid: Grid,
  start: Point,
  currentHeight: number,
  currentPath: Path,
  allPaths: Set<string>,
  distinctEndPoints: Set<string>,
): Promise<void> {
  const [x, y] = start;
  const pos = `${x},${y}`;
  
  // Base cases
  if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) return;
  if (currentPath.includes(pos)) return;
  if (grid[y][x] !== currentHeight) return;
  
  currentPath.push(pos);
  
  const currentPathSet = new Set(currentPath);
  const validPathsSet = new Set<string>();
  
  // If we reached a 9, record this as a valid path
  if (grid[y][x] === 9) {
    allPaths.add(currentPath.join('|'));
    distinctEndPoints.add(pos);
  }
  
  await sleep(CONFIG.SLEEP_TIME.STEP);
  visualizeGrid(
    grid, 
    currentPathSet, 
    validPathsSet, 
    start, 
    distinctEndPoints,
    `Part 2 - Exploring from (${start[0]},${start[1]}) - Current height: ${currentHeight}`,
    `Distinct paths: ${allPaths.size}`
  );
  
  // Only continue if we haven't reached 9
  if (currentHeight < 9) {
    const nextHeight = currentHeight + 1;
    // Try all four directions
    await exploreTrailsPart2(grid, [x, y-1], nextHeight, [...currentPath], allPaths, distinctEndPoints);
    await exploreTrailsPart2(grid, [x+1, y], nextHeight, [...currentPath], allPaths, distinctEndPoints);
    await exploreTrailsPart2(grid, [x, y+1], nextHeight, [...currentPath], allPaths, distinctEndPoints);
    await exploreTrailsPart2(grid, [x-1, y], nextHeight, [...currentPath], allPaths, distinctEndPoints);
  }
}

async function solve(input: string[]): Promise<[number, number]> {
  const grid: Grid = input.map(line => line.split('').map(Number));
  const trailheads = findTrailheads(grid);
  let totalScorePart1 = 0;
  let totalScorePart2 = 0;
  
  if (CONFIG.VISUALIZE) {
    console.log(`Found ${trailheads.length} trailheads`);
    await sleep(CONFIG.SLEEP_TIME.TRAILHEAD);
  }
  
  // Part 1
  for (const trailhead of trailheads) {
    const currentPath = new Set<string>();
    const validPaths = new Set<string>();
    const reachableNines = new Set<string>();
    
    await exploreTrailsPart1(grid, trailhead, 0, currentPath, validPaths, reachableNines);
    
    totalScorePart1 += reachableNines.size;
    
    if (CONFIG.VISUALIZE) {
      await sleep(CONFIG.SLEEP_TIME.TRAILHEAD);
      console.log(`Part 1 - Trailhead (${trailhead[0]},${trailhead[1]}) score: ${reachableNines.size}`);
    }
  }
  
  // Part 2
  for (const trailhead of trailheads) {
    const allPaths = new Set<string>();
    const distinctEndPoints = new Set<string>();
    
    await exploreTrailsPart2(grid, trailhead, 0, [], allPaths, distinctEndPoints);
    
    totalScorePart2 += allPaths.size;
    
    if (CONFIG.VISUALIZE) {
      await sleep(CONFIG.SLEEP_TIME.TRAILHEAD);
      console.log(`Part 2 - Trailhead (${trailhead[0]},${trailhead[1]}) score: ${allPaths.size}`);
    }
  }
  
  return [totalScorePart1, totalScorePart2];
}

if (import.meta.main) {
  const input = await readInputLines(10);
  
  console.time("Total Time");
  const [part1Result, part2Result] = await solve(input);
  console.timeEnd("Total Time");
  
  console.log(`\n${colors.bright}Results:${colors.reset}`);
  console.log(`${colors.bright}Part 1:${colors.reset} ${colors.green}${part1Result}${colors.reset}`);
  console.log(`${colors.bright}Part 2:${colors.reset} ${colors.green}${part2Result}${colors.reset}`);
}