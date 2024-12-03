const decoder = new TextDecoder("utf-8");

if (import.meta.main) {
    const data = await Deno.readFile("puzzleAssets/puzzleDay3.txt");
    const decodedData = decoder.decode(data);

    const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
    const matches = decodedData.match(pattern) || [];

    const sum = matches.reduce((total, mulString) => {
        const [, num1, num2] = mulString.match(/mul\((\d{1,3}),(\d{1,3})\)/)!;
        return total + (parseInt(num1) * parseInt(num2));
    }, 0);

    // part 2

    const patternPart2 = /(?:mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g;

    let enabled = true; 
    let total = 0;

    let match;
    while ((match = patternPart2.exec(decodedData)) !== null) {
        const instruction = match[0];

        if (instruction === 'do()') {
            enabled = true;
        } else if (instruction === "don't()") {
            enabled = false;
        } else if (enabled && instruction.startsWith('mul')) {
            const nums = instruction.match(/\d+/g);
            const product = parseInt(nums[0], 10) * parseInt(nums[1], 10);
            total += product;
        }
    }
    
    console.log(`Pt1 Answer: ${sum}`)
    console.log(`Pt2 Answer: ${total}`)

}
