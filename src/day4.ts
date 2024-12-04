import { readInputLines } from "@utils/file_utils.ts";

const DAY = 4;

// Part 1
const DIRECTIONS = [
  [0, 1],   // right
  [1, 0],   // down
  [0, -1],  // left
  [-1, 0],  // up
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
  [-1, 1],  // diagonal up-right
  [-1, -1], // diagonal up-left
];

function isValidPosition(grid: string[], row: number, col: number): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

function checkDirection(grid: string[], row: number, col: number, dRow: number, dCol: number): boolean {
  const word = "XMAS";
  
  if (!isValidPosition(grid, row + dRow * 3, col + dCol * 3)) {
    return false;
  }
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + dRow * i;
    const newCol = col + dCol * i;
    if (grid[newRow][newCol] !== word[i]) {
      return false;
    }
  }
  
  return true;
}

async function part1(input: string[]): Promise<number> {
  let count = 0;
  
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (input[row][col] === 'X') {
        for (const [dRow, dCol] of DIRECTIONS) {
          if (checkDirection(input, row, col, dRow, dCol)) {
            count++;
          }
        }
      }
    }
  }
  
  return count;
}

// Part 2
function checkMASPattern(
  grid: string[],
  row: number,
  col: number,
  dRow: number,
  dCol: number,
  forward: boolean
): boolean {
  const word = forward ? "MAS" : "SAM";
  
  if (!isValidPosition(grid, row + dRow * 2, col + dCol * 2)) {
    return false;
  }
  
  for (let i = 0; i < 3; i++) {
    const newRow = row + dRow * i;
    const newCol = col + dCol * i;
    if (grid[newRow][newCol] !== word[i]) {
      return false;
    }
  }
  
  return true;
}

function checkXMASPattern(grid: string[], row: number, col: number): boolean {
  if (grid[row][col] !== 'A') {
    return false;
  }

  const directions = [
    { dRow: [-1, 0, 1], dCol: [-1, 0, 1] }, // Diagonal from top-left to bottom-right
    { dRow: [-1, 0, 1], dCol: [1, 0, -1] }, // Diagonal from top-right to bottom-left
  ];

  let validDiagonalCount = 0;

  for (const dir of directions) {
    const positions = [
      [row + dir.dRow[0], col + dir.dCol[0]],
      [row + dir.dRow[1], col + dir.dCol[1]],
      [row + dir.dRow[2], col + dir.dCol[2]],
    ];

    if (!positions.every(([r, c]) => isValidPosition(grid, r, c))) {
      continue;
    }

    const letters = positions.map(([r, c]) => grid[r][c]);

    const word = letters.join('');

    if (word === 'MAS' || word === 'SAM') {
      validDiagonalCount++;
    }
  }

  return validDiagonalCount === 2;
}

async function part2(input: string[]): Promise<number> {
  let count = 0;

  for (let row = 1; row < input.length - 1; row++) {
    for (let col = 1; col < input[row].length - 1; col++) {
      if (checkXMASPattern(input, row, col)) {
        count++;
      }
    }
  }

  return count;
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