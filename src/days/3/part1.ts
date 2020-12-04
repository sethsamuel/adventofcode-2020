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
    let x = 0;
    let y = 0;
    const dx = 3;
    const dy = 1;
    let treesCount = 0;
    while (y < lines.length) {
      const line = lines[y];
      if (line[x % line.length] === "#") {
        treesCount++;
      }
      x += dx;
      y += dy;
    }

    postMessage({ command: "RESULT", result: treesCount }, null);
  }
};

console.log("Worker loaded");
