self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n").map((l) => parseInt(l));
    console.log(`${lines.length} lines of input`);

    const data = lines.map((l) => parseInt(l));
    const checkEntry = (i: number) => {
      for (let j = i + 1; j < lines.length; j++) {
        if (data[i] + data[j] === 2020) {
          postMessage({ command: "RESULT", result: data[i] * data[j] }, null);
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
