const decoder = new TextDecoder("utf-8");

if (import.meta.main) {
  const data = await Deno.readFile("puzzleAssets/puzzleDay2.txt");
  const decodedData = decoder.decode(data);

  const reports = decodedData
    .trim()
    .split('\n')
    .map(line => 
      line.split(/\s+/).map(Number)
    );

  const isSequenceSafe = (report: number[]) => {
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
  };

  const isSafeWithDampener = (report: number[]) => {
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
  };

  const safeReports = reports.filter(isSafeWithDampener).length;
  console.log("Number of safe reports with Problem Dampener:", safeReports);

}
