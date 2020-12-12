import _ from "lodash";

type SeatMap = ("." | "L" | "#")[];
// type SeatMap = string;

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines: SeatMap[] = input.split("\n");
    console.log(`${lines.length} lines of input`);

    const parseLine = (l) =>
      [l.slice(0, 1), parseInt(l.slice(1))] as [string, number];

    const commands: [string, number][] = lines.map(parseLine);
    console.log(commands);
    let facing = "E";
    let x = 0;
    let y = 0;
    const directions = ["N", "E", "S", "W"];
    const move = (direction, distance) => {
      if (direction === "N") {
        y += distance;
      } else if (direction === "S") {
        y -= distance;
      } else if (direction === "W") {
        x -= distance;
      } else if (direction === "E") {
        x += distance;
      }
    };
    commands.forEach((c) => {
      if (directions.includes(c[0])) {
        move(c[0], c[1]);
      } else if (c[0] === "L") {
        const shift = c[1] / -90;
        facing =
          directions[
            (directions.indexOf(facing) + shift + directions.length) %
              directions.length
          ];
      } else if (c[0] === "R") {
        const shift = c[1] / 90;
        facing =
          directions[
            (directions.indexOf(facing) + shift + directions.length) %
              directions.length
          ];
      } else if (c[0] === "F") {
        move(facing, c[1]);
      }
      console.log(facing, x, y);
    });

    postMessage(
      {
        command: "RESULT",
        result: Math.abs(x) + Math.abs(y),
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
