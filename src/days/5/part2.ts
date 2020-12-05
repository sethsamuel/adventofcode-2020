import _ from "lodash";

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n");
    console.log(`${lines.length} lines of input`);

    const parseLine = (line: string) => {
      // debugger;
      let rowRange = [0, 127];
      const rows = line.slice(0, 7).split("");
      let char;
      while ((char = rows.shift())) {
        const remaining = rowRange[1] - rowRange[0] + 1;
        if (char === "F") {
          rowRange[1] = rowRange[0] + remaining / 2 - 1;
        } else if (char === "B") {
          rowRange[0] = rowRange[0] + remaining / 2;
        } else {
          console.error("Unknown row", line);
        }
      }
      console.log(rowRange);
      const columns = line.slice(7, 10).split("");
      let columnRange = [0, 7];
      while ((char = columns.shift())) {
        const remaining = columnRange[1] - columnRange[0] + 1;
        if (char === "L") {
          columnRange[1] = columnRange[0] + remaining / 2 - 1;
        } else if (char === "R") {
          columnRange[0] = columnRange[0] + remaining / 2;
        } else {
          console.error("Unknown column", line);
        }
      }
      // debugger;
      console.log(columnRange);
      return rowRange[0] * 8 + columnRange[0];
    };

    const seats: number[] = lines.map(parseLine);
    seats.sort((a, b) => (a > b ? 1 : -1));
    debugger;
    for (let i = 0; i < seats.length; i++) {
      if (seats[i + 1] - seats[i] === 2) {
        postMessage({ command: "RESULT", result: seats[i] + 1 }, null);
        return;
      }
    }

    // const max = lines.reduce((max, line) => Math.max(parseLine(line), max), 0);

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );

    // postMessage({ command: "RESULT", result: max }, null);
  }
};

console.log("Worker loaded");
