import { readInputLines } from "@utils/file_utils.ts";

const DAY = 5;

type Rule = {
  before: number;
  after: number;
};

function parseInput(input: string[]): {
  rules: Rule[];
  updates: number[][];
} {
  const rules: Rule[] = [];
  const updates: number[][] = [];
  
  let parsingRules = true;
  
  for (const line of input) {
    if (line === "") {
      parsingRules = false;
      continue;
    }
    
    if (parsingRules) {
      const [before, after] = line.split("|").map(Number);
      rules.push({ before, after });
    } else {
      updates.push(line.split(",").map(Number));
    }
  }
  
  return { rules, updates };
}

function isValidUpdate(update: number[], rules: Rule[]): boolean {
  for (let i = 0; i < update.length; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const firstPage = update[i];
      const secondPage = update[j];
      for (const rule of rules) {
        if (rule.before === secondPage && rule.after === firstPage) {
          return false;
        }
      }
    }
  }
  
  return true;
}

function getMiddlePage(update: number[]): number {
  return update[Math.floor(update.length / 2)];
}

function createDependencyGraph(pages: number[], rules: Rule[]): Map<number, Set<number>> {
  const graph = new Map<number, Set<number>>();
  
  for (const page of pages) {
    graph.set(page, new Set<number>());
  }
  
  for (const rule of rules) {
    if (pages.includes(rule.before) && pages.includes(rule.after)) {
      const dependencies = graph.get(rule.after) || new Set<number>();
      dependencies.add(rule.before);
      graph.set(rule.after, dependencies);
    }
  }
  
  return graph;
}

function orderPages(pages: number[], rules: Rule[]): number[] {
  const graph = createDependencyGraph(pages, rules);
  const result: number[] = [];
  const visited = new Set<number>();
  const temporaryMark = new Set<number>();

  function visit(page: number) {
    if (temporaryMark.has(page)) {
      throw new Error("Circular dependency detected");
    }
    if (visited.has(page)) {
      return;
    }

    temporaryMark.add(page);
    const dependencies = graph.get(page) || new Set<number>();
    for (const dep of dependencies) {
      visit(dep);
    }
    temporaryMark.delete(page);
    visited.add(page);
    result.unshift(page);
  }

  for (const page of pages) {
    if (!visited.has(page)) {
      visit(page);
    }
  }

  return result;
}

async function part1(input: string[]): Promise<number> {
  const { rules, updates } = parseInput(input);
  
  const validMiddlePages = updates
    .filter(update => isValidUpdate(update, rules))
    .map(getMiddlePage);
  
  return validMiddlePages.reduce((sum, page) => sum + page, 0);
}

async function part2(input: string[]): Promise<number> {
  const { rules, updates } = parseInput(input);
  
  const invalidUpdates = updates.filter(update => !isValidUpdate(update, rules));
  
  const orderedMiddlePages = invalidUpdates
    .map(update => orderPages(update, rules))
    .map(getMiddlePage);
  
  return orderedMiddlePages.reduce((sum, page) => sum + page, 0);
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