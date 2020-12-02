import _ from "lodash";

interface Line {
  min: number;
  max: number;
  letter: string;
  password: string;
}

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n");
    console.log(`${lines.length} lines of input`);

    const parseLine = (l) => {
      const parts = l.split(" ");
      const range = parts[0].split("-");
      const letter = parts[1][0];
      const password = parts.pop();
      return {
        min: parseInt(range[0]),
        max: parseInt(range[1]),
        letter,
        password,
      } as Line;
    };

    const validate = (d: Line) => {
      return (
        (d.password[d.min - 1] === d.letter) !==
        (d.password[d.max - 1] === d.letter)
      );
    };

    const data = lines.map((l) => parseLine(l));

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );

    const valid = data.filter(validate);
    postMessage({ command: "RESULT", result: valid.length }, null);
  }
};

console.log("Worker loaded");
