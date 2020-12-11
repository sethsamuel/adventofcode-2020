import _ from "lodash";

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines: number[] = input.split("\n").map((l) => parseInt(l));
    console.log(`${lines.length} lines of input`);

    const adapters = lines.sort((a, b) => a - b);
    adapters.unshift(0);
    const isValid = (adapters) => {
      for (let i = 1; i < adapters.length; i++) {
        if (adapters[i] - adapters[i - 1] > 3) {
          return false;
        }
      }
      // console.log(adapters);
      return true;
    };
    const validArrangements = (adapters, offset, isTop = false) => {
      // debugger;
      if (adapters[offset] - adapters[offset - 1] > 3) {
        return 0;
      }
      let valid = 1;
      for (let i = offset; i < adapters.length - 1; i++) {
        if (isTop) {
          console.log(i / lines.length);
          postMessage(
            { command: "PROGRESS", complete: i, total: lines.length },
            null
          );
        }
        valid += validArrangements(
          [...adapters.slice(0, i), ...adapters.slice(i + 1, adapters.length)],
          i
        );
      }
      return valid;
    };
    console.log(adapters);
    //@ts-ignore
    const adapterSplits: number[] = adapters
      .map((v, i) => (adapters[i + 1] - adapters[i] === 3 ? i : false))
      .filter((v) => v !== false);
    adapterSplits.push(adapters.length - 1);
    console.log(adapterSplits);
    const splitAdapters = adapterSplits.map((s, i) => [
      ...adapters.slice(i === 0 ? 0 : adapterSplits[i - 1] + 1, s + 1),
    ]);
    console.log(splitAdapters);
    // const result = validArrangements(adapters, 1, true);
    const result = splitAdapters.reduce(
      (acc, adapters) => validArrangements(adapters, 1) * acc,
      1
    );
    postMessage(
      {
        command: "RESULT",
        result,
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
