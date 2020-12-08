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
    const executeInstructions = (instructions: Instruction[]) => {
      const usedInstructions = {};
      let accumulator = 0;
      let i = 0;
      // debugger;
      while (true) {
        if (usedInstructions[i]) {
          throw "Infinite loop";
        }
        usedInstructions[i] = true;

        const instruction = instructions[i];
        if (!instruction) {
          if (i === instructions.length) {
            return accumulator;
          }
          throw "Too far out of bounds";
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
    };

    for (let i = 0; i < instructions.length; i++) {
      const modifiedInstructions = [...instructions.map((i) => ({ ...i }))];
      if (modifiedInstructions[i].operation === "nop") {
        modifiedInstructions[i].operation = "jmp";
      } else if (modifiedInstructions[i].operation === "jmp") {
        modifiedInstructions[i].operation = "nop";
      } else {
        continue;
      }
      // debugger;
      try {
        const result = executeInstructions(modifiedInstructions);
        postMessage({ command: "RESULT", result }, null);
        return;
      } catch {}
    }

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );
  }
};

console.log("Worker loaded");
