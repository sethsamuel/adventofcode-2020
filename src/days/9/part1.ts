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
    while (offset < lines.length) {
      const previous = lines.slice(offset - window, offset);
      // debugger;
      if (!isValid(lines[offset], previous)) {
        postMessage({ command: "RESULT", result: lines[offset] }, null);
        return;
      }
      offset++;
    }

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );
  }
};

console.log("Worker loaded");
