import _ from "lodash";

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n");
    console.log(`${lines.length} lines of input`);

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );
    const slopes = [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ];
    const trees = slopes.map((slope) => {
      let x = 0;
      let y = 0;
      const [dx, dy] = slope;

      let treesCount = 0;
      while (y < lines.length) {
        const line = lines[y];
        if (line[x % line.length] === "#") {
          treesCount++;
        }
        x += dx;
        y += dy;
      }
      return treesCount;
    });
    postMessage(
      { command: "RESULT", result: trees.reduce((acc, val) => acc * val, 1) },
      null
    );
  }
};

console.log("Worker loaded");
