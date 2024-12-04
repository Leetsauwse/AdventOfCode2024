import { readInput, readInputLines, readInputNumbers } from "@utils/file_utils.ts";

const DAY = 2;

type Report = number[];

function parseReports(input: string[]): Report[] {
  return input.map(line => line.split(/\s+/).map(Number));
}

function isSequenceSafe(report: Report): boolean {
  let isIncreasing = true;
  let isDecreasing = true;

  for (let i = 1; i < report.length; i++) {
    const diff = report[i] - report[i - 1];
    
    if (diff <= 0 || diff > 3) {
      isIncreasing = false;
    }
    
    if (diff >= 0 || diff < -3) {
      isDecreasing = false;
    }

    if (!isIncreasing && !isDecreasing) {
      return false;
    }
  }

  return isIncreasing || isDecreasing;
}

async function part1(input: string[]): Promise<number> {
  const reports = parseReports(input);
  return reports.filter(isSequenceSafe).length;
}

function isSafeWithDampener(report: Report): boolean {
  if (isSequenceSafe(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
    if (isSequenceSafe(modifiedReport)) {
      return true;
    }
  }

  return false;
}

async function part2(input: string[]): Promise<number> {
  const reports = parseReports(input);
  return reports.filter(isSafeWithDampener).length;
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
