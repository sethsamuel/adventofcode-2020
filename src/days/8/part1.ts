import _ from "lodash";

type Instruction = {
  operation: "nop" | "jmp" | "acc";
  argument: number;
};

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n");
    console.log(`${lines.length} lines of input`);

    const parseLine = (line: string) => {
      const parts = line.split(" ");
      return { operation: parts[0], argument: parseInt(parts[1]) };
    };

    const instructions: Instruction[] = lines.map(parseLine);
    const usedInstructions = {};
    let accumulator = 0;
    let i = 0;
    // debugger;
    while (true) {
      if (usedInstructions[i]) {
        break;
      }
      usedInstructions[i] = true;

      const instruction = instructions[i];
      if (!instruction) {
        console.error("Instrution out of bounds");
        return;
      }
      if (instruction.operation === "acc") {
        accumulator += instruction.argument;
        i++;
      } else if (instruction.operation === "nop") {
        i++;
      } else if (instruction.operation === "jmp") {
        i += instruction.argument;
      }
    }

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );

    postMessage({ command: "RESULT", result: accumulator }, null);
  }
};

console.log("Worker loaded");
