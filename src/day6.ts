import { readInputLines } from "@utils/file_utils.ts";

const DAY = 6;

// types
type Direction = "^" | ">" | "v" | "<";
type Position = { x: number; y: number };
type Guard = {
  position: Position;
  direction: Direction;
};

// Direction handling
const DIRECTIONS: Direction[] = ["^", ">", "v", "<"];
const MOVES = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  "v": { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};

function turnRight(direction: Direction): Direction {
  const currentIndex = DIRECTIONS.indexOf(direction);
  return DIRECTIONS[(currentIndex + 1) % DIRECTIONS.length];
}

function findGuardStart(grid: string[]): Guard | null {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if ("^>v<".includes(grid[y][x])) {
        return {
          position: { x, y },
          direction: grid[y][x] as Direction,
        };
      }
    }
  }
  return null;
}

function isInBounds(pos: Position, grid: string[]): boolean {
  return (
    pos.y >= 0 &&
    pos.y < grid.length &&
    pos.x >= 0 &&
    pos.x < grid[0].length
  );
}

function hasObstacle(pos: Position, grid: string[]): boolean {
  return grid[pos.y][pos.x] === "#";
}

function getNextPosition(guard: Guard): Position {
  const move = MOVES[guard.direction];
  return {
    x: guard.position.x + move.x,
    y: guard.position.y + move.y,
  };
}

function copyGrid(grid: string[][]): string[][] {
  return grid.map(row => [...row]);
}

function simulateGuardMovement(
  grid: string[][],
  startGuard: Guard,
  maxSteps = 10000
): Set<string> | null {
  const guard = { ...startGuard, position: { ...startGuard.position } };
  const visited = new Set<string>();
  const stateHistory = new Set<string>();
  
  let steps = 0;
  while (steps < maxSteps) {
    const stateKey = `${guard.position.x},${guard.position.y},${guard.direction}`;
    if (stateHistory.has(stateKey)) {
      return visited;
    }
    stateHistory.add(stateKey);
    visited.add(`${guard.position.x},${guard.position.y}`);

    const nextPos = getNextPosition(guard);
    if (!isInBounds(nextPos, grid)) {
      return null;
    }

    if (hasObstacle(nextPos, grid)) {
      guard.direction = turnRight(guard.direction);
      continue;
    }

    guard.position = nextPos;
    steps++;
  }
  
  return null;
}

async function part1(input: string[]): Promise<number> {
  const grid = input.map(line => line.split(""));
  const guard = findGuardStart(grid);
  
  if (!guard) {
    throw new Error("No guard found in input");
  }

  const visited = new Set<string>();
  visited.add(`${guard.position.x},${guard.position.y}`);

  while (true) {
    const nextPos = getNextPosition(guard);
    if (!isInBounds(nextPos, grid)) {
      break;
    }

    if (hasObstacle(nextPos, grid)) {
      guard.direction = turnRight(guard.direction);
      continue;
    }

    guard.position = nextPos;
    visited.add(`${guard.position.x},${guard.position.y}`);
  }

  return visited.size;
}

async function part2(input: string[]): Promise<number> {
  const grid = input.map(line => line.split(""));
  const guard = findGuardStart(grid);
  
  if (!guard) {
    throw new Error("No guard found in input");
  }

  const startPos = `${guard.position.x},${guard.position.y}`;
  let loopPositions = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] !== "." || `${x},${y}` === startPos) {
        continue;
      }

      const testGrid = copyGrid(grid);
      testGrid[y][x] = "#";

      const loopVisited = simulateGuardMovement(testGrid, guard);
      
      if (loopVisited) {
        loopPositions++;
      }
    }
  }

  return loopPositions;
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