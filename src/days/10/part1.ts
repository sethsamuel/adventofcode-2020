import _ from "lodash";

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines: number[] = input.split("\n").map((l) => parseInt(l));
    console.log(`${lines.length} lines of input`);

    const adapters = lines.sort((a, b) => a - b);
    const jumps = { 1: 0, 2: 0, 3: 1 };
    adapters.unshift(0);
    for (let i = 1; i < adapters.length; i++) {
      jumps[adapters[i] - adapters[i - 1]]++;
    }

    postMessage(
      {
        command: "RESULT",
        result: jumps[1] * jumps[3],
      },
      null
    );
    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );
  }
};

console.log("Worker loaded");
