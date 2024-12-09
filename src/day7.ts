import { readInputLines } from "@utils/file_utils.ts";

const DAY = 7;

function concatenateNumbers(a: number, b: number): number {
    return parseInt(`${a}${b}`);
}

function evaluateExpression(values: number[], operators: string[], includeConcatenation = false): number {
    let result = values[0];
    for (let i = 0; i < operators.length; i++) {
        const nextValue = values[i + 1];
        switch (operators[i]) {
            case '+':
                result += nextValue;
                break;
            case '*':
                result *= nextValue;
                break;
            case '||':
                result = concatenateNumbers(result, nextValue);
                break;
        }
    }
    return result;
}

function generateOperatorCombinations(positions: number, includeConcatenation = false): string[][] {
    const combinations: string[][] = [];
    const operators = includeConcatenation ? ['+', '*', '||'] : ['+', '*'];
    const base = operators.length;
    
    for (let i = 0; i < Math.pow(base, positions); i++) {
        const combination: string[] = [];
        let num = i;
        for (let j = 0; j < positions; j++) {
            const operatorIndex = num % base;
            combination.push(operators[operatorIndex]);
            num = Math.floor(num / base);
        }
        combinations.push(combination);
    }
    
    return combinations;
}

function checkForValidLine(total: number, values: number[], includeConcatenation = false): boolean {
    const positions = values.length - 1;
    const operatorCombinations = generateOperatorCombinations(positions, includeConcatenation);
    
    for (const operators of operatorCombinations) {
        if (evaluateExpression(values, operators, includeConcatenation) === total) {
            return true;
        }
    }
    
    return false;
}

async function part1(input: string[]): Promise<number> {
    let sum = 0;
    
    for (const line of input) {
        const [totalStr, valuesStr] = line.split(':');
        const total = parseInt(totalStr);
        const values = valuesStr.trim().split(' ').map(Number);
        
        if (checkForValidLine(total, values)) {
            sum += total;
        }
    }
    
    return sum;
}

async function part2(input: string[]): Promise<number> {
    let sum = 0;
    
    for (const line of input) {
        const [totalStr, valuesStr] = line.split(':');
        const total = parseInt(totalStr);
        const values = valuesStr.trim().split(' ').map(Number);
        
        if (checkForValidLine(total, values, true)) {
            sum += total;
        }
    }
    
    return sum;
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