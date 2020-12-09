import _ from "lodash";

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n").map((l) => parseInt(l));
    console.log(`${lines.length} lines of input`);

    const window = 25;
    let offset = window;
    const isValid = (value, previous) => {
      for (let i = 0; i < previous.length; i++) {
        for (let j = i + 1; j < previous.length; j++) {
          if (previous[i] + previous[j] === value) {
            return true;
          }
        }
      }
      return false;
    };
    const invalidNumber = (() => {
      while (offset < lines.length) {
        const previous = lines.slice(offset - window, offset);
        // debugger;
        if (!isValid(lines[offset], previous)) {
          return lines[offset];
        }
        offset++;
      }
    })();

    for (let i = 0; i < lines.length; i++) {
      postMessage(
        { command: "PROGRESS", complete: i, total: lines.length },
        null
      );
      for (let j = i + 2; j < lines.length; j++) {
        const slice = lines.slice(i, j);

        if (slice.reduce((acc, v) => acc + v, 0) === invalidNumber) {
          // debugger;
          postMessage(
            {
              command: "RESULT",
              result: Math.min(...slice) + Math.max(...slice),
            },
            null
          );

          return;
        }
      }
    }
  }
};

console.log("Worker loaded");
