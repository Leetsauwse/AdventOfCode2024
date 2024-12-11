import { readInput, readInputLines, readInputNumbers } from "@utils/file_utils.ts";

const DAY = 9;

type Block = {
  fileId: number;
  length: number;
  isFree: boolean;
};

function parseInput(input: string): Block[] {
  const blocks: Block[] = [];
  let fileId = 0;
  const lengths = input.split('').map(Number);
  
  for (let i = 0; i < lengths.length; i++) {
    blocks.push({
      fileId: i % 2 === 0 ? fileId++ : -1,
      length: lengths[i],
      isFree: i % 2 === 1
    });
  }
  
  return blocks;
}

function convertToIndividualBlocks(blocks: Block[]): string[] {
  const result: string[] = [];
  for (const block of blocks) {
    for (let i = 0; i < block.length; i++) {
      if (block.isFree) {
        result.push('.');
      } else {
        result.push(block.fileId.toString());
      }
    }
  }
  return result;
}

function findNextMove(individualBlocks: string[]): [number, number] | null {
  let rightmostFileIndex = individualBlocks.length - 1;
  while (rightmostFileIndex >= 0 && individualBlocks[rightmostFileIndex] === '.') {
    rightmostFileIndex--;
  }
  
  if (rightmostFileIndex < 0) return null;
  
  let leftmostFreeIndex = 0;
  while (leftmostFreeIndex < rightmostFileIndex && individualBlocks[leftmostFreeIndex] !== '.') {
    leftmostFreeIndex++;
  }
  
  if (leftmostFreeIndex >= rightmostFileIndex) return null;
  
  return [rightmostFileIndex, leftmostFreeIndex];
}

function findFileSpan(blocks: string[], startIndex: number): [number, number] {
  const fileId = blocks[startIndex];
  let start = startIndex;
  let end = startIndex;
  
  // Find start of file
  while (start > 0 && blocks[start - 1] === fileId) {
    start--;
  }
  
  // Find end of file
  while (end < blocks.length - 1 && blocks[end + 1] === fileId) {
    end++;
  }
  
  return [start, end];
}

function findFreeSpaceForFile(blocks: string[], fileSize: number, maxPosition: number): number | null {
  let currentSpaceStart = 0;
  let currentSpaceSize = 0;
  
  for (let i = 0; i <= maxPosition; i++) {
    if (blocks[i] === '.') {
      if (currentSpaceSize === 0) {
        currentSpaceStart = i;
      }
      currentSpaceSize++;
      
      if (currentSpaceSize >= fileSize) {
        return currentSpaceStart;
      }
    } else {
      currentSpaceSize = 0;
    }
  }
  
  return null;
}

async function part1(input: string): Promise<number> {
  const initialBlocks = parseInput(input);
  let individualBlocks = convertToIndividualBlocks(initialBlocks);
  
  while (true) {
    const move = findNextMove(individualBlocks);
    if (!move) break;
    
    const [sourceIndex, targetIndex] = move;
    
    // Move single block
    const movingBlock = individualBlocks[sourceIndex];
    individualBlocks[sourceIndex] = '.';
    individualBlocks[targetIndex] = movingBlock;
  }
  
  // Calculate checksum
  let checksum = 0;
  for (let i = 0; i < individualBlocks.length; i++) {
    if (individualBlocks[i] !== '.') {
      checksum += i * parseInt(individualBlocks[i]);
    }
  }
  
  return checksum;
}

async function part2(input: string): Promise<number> {
  const initialBlocks = parseInput(input);
  let individualBlocks = convertToIndividualBlocks(initialBlocks);
  
  // Find highest file ID
  let maxFileId = -1;
  for (const block of individualBlocks) {
    if (block !== '.' && parseInt(block) > maxFileId) {
      maxFileId = parseInt(block);
    }
  }
  
  // Process files in descending order of file ID
  for (let fileId = maxFileId; fileId >= 0; fileId--) {
    // Find first occurrence of current file
    const fileIndex = individualBlocks.findIndex(block => block === fileId.toString());
    if (fileIndex === -1) continue;
    
    // Get full span of file
    const [fileStart, fileEnd] = findFileSpan(individualBlocks, fileIndex);
    const fileSize = fileEnd - fileStart + 1;
    
    // Find suitable free space
    const targetPosition = findFreeSpaceForFile(individualBlocks, fileSize, fileStart);
    
    // If we found a suitable position and it's to the left of the current position
    if (targetPosition !== null && targetPosition < fileStart) {
      // Copy the file
      const fileContents = individualBlocks.slice(fileStart, fileEnd + 1);
      
      // Clear old position
      for (let i = fileStart; i <= fileEnd; i++) {
        individualBlocks[i] = '.';
      }
      
      // Place in new position
      for (let i = 0; i < fileContents.length; i++) {
        individualBlocks[targetPosition + i] = fileContents[i];
      }
    }
  }
  
  // Calculate checksum
  let checksum = 0;
  for (let i = 0; i < individualBlocks.length; i++) {
    if (individualBlocks[i] !== '.') {
      checksum += i * parseInt(individualBlocks[i]);
    }
  }
  
  return checksum;
}

if (import.meta.main) {
  const input = await readInput(DAY);
  
  console.time("Part 1");
  const part1Result = await part1(input);
  console.timeEnd("Part 1");
  console.log("Part 1:", part1Result);
  
  console.time("Part 2");
  const part2Result = await part2(input);
  console.timeEnd("Part 2");
  console.log("Part 2:", part2Result);
}

export { part1, part2 };