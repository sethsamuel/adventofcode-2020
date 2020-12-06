import _ from "lodash";

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const groups = input.split("\n\n");
    console.log(`${groups.length} lines of input`);

    const parseGroup = (group: string) => {
      const lines = group.split("\n");
      const keys = {};
      lines
        .pop()
        .split("")
        .forEach((c) => (keys[c] = true));

      lines.forEach((l) =>
        Object.keys(keys).forEach((k) =>
          !l.includes(k) ? delete keys[k] : null
        )
      );

      return keys;
    };

    const sum = groups.reduce(
      (sum, group) => sum + Object.keys(parseGroup(group)).length,
      0
    );

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );

    postMessage({ command: "RESULT", result: sum }, null);
  }
};

console.log("Worker loaded");
