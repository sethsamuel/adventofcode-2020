self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n").map((l) => parseInt(l));
    console.log(`${lines.length} lines of input`);

    const data = lines.map((l) => parseInt(l));
    const checkEntry = (i: number) => {
      for (let j = 0; j < lines.length; j++) {
        for (let k = 0; k < lines.length; k++)
          if (
            i !== j &&
            j !== k &&
            i !== k &&
            data[i] + data[j] + data[k] === 2020
          ) {
            postMessage(
              { command: "RESULT", result: data[i] * data[j] * data[k] },
              null
            );
            return true;
          }
      }

      postMessage(
        { command: "PROGRESS", complete: i, total: lines.length },
        null
      );
      return false;
    };

    for (let i = 0; i < lines.length; i++) {
      if (checkEntry(i)) {
        break;
      }
    }
  }
};

console.log("Worker loaded");
