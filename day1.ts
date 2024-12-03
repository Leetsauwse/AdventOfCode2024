const decoder = new TextDecoder("utf-8");

if (import.meta.main) {
  const data = await Deno.readFile("puzzle1.txt");
  
  const leftArray: number[] = []
  const rightArray: number [] = []

  const lines = decoder.decode(data).split("\n");
  lines.forEach(line => {
    const [left, right] = line.split(/\s+/).map(Number);
    leftArray.push(left)
    rightArray.push(right)
  })

  const sortedArrayLeft = leftArray.slice().sort((a: number, b: number) => a - b);
  const sortedArrayRight = rightArray.slice().sort((a: number, b: number) => a - b);

  const frequencyMap = {};
  sortedArrayRight.forEach(num => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1; 
  });

  console.log("Frequency Map of Right List:", frequencyMap);

  
  let similarityScore = 0;
  sortedArrayLeft.forEach(num => {
    const frequency = frequencyMap[num] || 0; 
    similarityScore += num * frequency; 
  });

  console.log(similarityScore);
}
