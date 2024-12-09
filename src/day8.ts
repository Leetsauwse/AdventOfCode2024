import { readInput, readInputLines, readInputNumbers } from "@utils/file_utils.ts";

const DAY = 8;

type Point = [number, number];
type Grid = string[][];

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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getGridString(grid: Grid, antinodes: Set<string>): string[] {
  const lines: string[] = [];
  
  for (let y = 0; y < grid.length; y++) {
    let line = "";
    for (let x = 0; x < grid[y].length; x++) {
      const isAntinode = antinodes.has(`${x},${y}`);
      const cell = grid[y][x];
      
      if (isAntinode && cell !== '.') {
        line += colors.bgMagenta + colors.bright + cell + colors.reset + " ";
      } else if (isAntinode) {
        line += colors.red + colors.bright + "#" + colors.reset + " ";
      } else if (cell !== '.') {
        line += colors.blue + colors.bright + cell + colors.reset + " ";
      } else {
        line += colors.dim + "·" + colors.reset + " ";
      }
    }
    lines.push(line);
  }
  return lines;
}

function visualizeParallel(
  grid: Grid, 
  antinodes1: Set<string>, 
  antinodes2: Set<string>, 
  step1: string, 
  step2: string
) {
  console.clear();
  const part1Lines = getGridString(grid, antinodes1);
  const part2Lines = getGridString(grid, antinodes2);
  
  console.log("\n" + colors.cyan + "Part 1: Original Rules" + colors.reset + " ".repeat(grid[0].length) + colors.cyan + "Part 2: Resonant Harmonics" + colors.reset);
  console.log(colors.bright + step1 + colors.reset + " ".repeat(Math.max(0, grid[0].length * 2 - step1.length + 10)) + colors.bright + step2 + colors.reset);
  console.log(colors.dim + "─".repeat(grid[0].length * 2) + "     " + "─".repeat(grid[0].length * 2) + colors.reset);
  
  for (let i = 0; i < grid.length; i++) {
    console.log(part1Lines[i] + "    " + part2Lines[i]);
  }
  
  console.log(colors.dim + "─".repeat(grid[0].length * 2) + "     " + "─".repeat(grid[0].length * 2) + colors.reset);
  console.log(
    `${colors.yellow}Antinodes: ${colors.bright}${antinodes1.size}${colors.reset}` + 
    " ".repeat(grid[0].length * 2 - 5) +
    `${colors.yellow}Antinodes: ${colors.bright}${antinodes2.size}${colors.reset}`
  );
}


function findAntennas(grid: Grid, frequency: string): Point[] {
  const antennas: Point[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === frequency) {
        antennas.push([x, y]);
      }
    }
  }
  return antennas;
}

function isCollinear(p1: Point, p2: Point, p3: Point): boolean {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;
  
  // Calculate the area of the triangle formed by these points
  // If area is 0, points are collinear
  const area = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
  return Math.abs(area) < 0.0001; 
}

function findAllCollinearPoints(ant1: Point, ant2: Point, grid: Grid): Point[] {
  const points: Point[] = [];
  const [x1, y1] = ant1;
  const [x2, y2] = ant2;
  
  // Check every point in the grid
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (isCollinear([x1, y1], [x2, y2], [x, y])) {
        points.push([x, y]);
      }
    }
  }
  
  return points;
}

function isInBounds(point: Point, grid: Grid): boolean {
  return point[0] >= 0 && point[0] < grid[0].length && 
         point[1] >= 0 && point[1] < grid.length;
}

function distance(p1: Point, p2: Point): number {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function findAntinodes(ant1: Point, ant2: Point, grid: Grid): Point[] {
  const [x1, y1] = ant1;
  const [x2, y2] = ant2;
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = distance(ant1, ant2);
  
  if (dist === 0) return [];
  
  const antinodes: Point[] = [];
  
  // Check points beyond ant2
  const far1: Point = [
    Math.round(x1 + 2 * dx),
    Math.round(y1 + 2 * dy)
  ];
  
  // Check points before ant1
  const far2: Point = [
    Math.round(x2 - 2 * dx),
    Math.round(y2 - 2 * dy)
  ];
  
  for (const point of [far1, far2]) {
    if (isInBounds(point, grid)) {
      const d1 = distance(point, ant1);
      const d2 = distance(point, ant2);
      if (Math.abs(d1/d2 - 2) < 0.01 || Math.abs(d2/d1 - 2) < 0.01) {
        antinodes.push(point);
      }
    }
  }
  
  return antinodes;
}

async function solveBothParts(input: string[]): Promise<[number, number]> {
  const grid = input.map(row => row.split(''));
  const antinodes1 = new Set<string>();
  const antinodes2 = new Set<string>();
  
  // Initial visualization
  visualizeParallel(grid, antinodes1, antinodes2, "Initial Grid", "Initial Grid");
  await sleep(1000);
  
  const frequencies = new Set<string>();
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== '.') {
        frequencies.add(cell);
      }
    }
  }
  
  for (const frequency of frequencies) {
    const antennas = findAntennas(grid, frequency);
    
    // Part 2: Add antenna positions as antinodes if multiple exist
    if (antennas.length > 1) {
      for (const ant of antennas) {
        antinodes2.add(`${ant[0]},${ant[1]}`);
      }
    }
    
    for (let i = 0; i < antennas.length; i++) {
      for (let j = i + 1; j < antennas.length; j++) {
        // Part 1: Find distance-based antinodes
        const nodes1 = findAntinodes(antennas[i], antennas[j], grid);
        for (const node of nodes1) {
          antinodes1.add(`${node[0]},${node[1]}`);
        }
        
        // Part 2: Find all collinear points
        const nodes2 = findAllCollinearPoints(antennas[i], antennas[j], grid);
        for (const node of nodes2) {
          antinodes2.add(`${node[0]},${node[1]}`);
        }
        
        await sleep(50);
        visualizeParallel(
          grid, 
          antinodes1, 
          antinodes2,
          `Processing ${frequency} pair (${i+1},${j+1})`,
          `Processing ${frequency} pair (${i+1},${j+1})`
        );
      }
    }
  }
  
  // Final visualization
  await sleep(500);
  visualizeParallel(
    grid, 
    antinodes1, 
    antinodes2,
    "Final Result",
    "Final Result"
  );
  
  return [antinodes1.size, antinodes2.size];
}

if (import.meta.main) {
  const input = await readInputLines(DAY);
  
  console.time("Total Time");
  const [part1Result, part2Result] = await solveBothParts(input);
  console.timeEnd("Total Time");
  
  console.log(`\n${colors.bright}Results:${colors.reset}`);
  console.log(`${colors.bright}Part 1:${colors.reset} ${colors.green}${part1Result}${colors.reset}`);
  console.log(`${colors.bright}Part 2:${colors.reset} ${colors.green}${part2Result}${colors.reset}`);
}