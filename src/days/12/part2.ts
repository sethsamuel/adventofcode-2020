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
    let shipX = 0;
    let shipY = 0;
    let waypointX = 10;
    let waypointY = 1;
    const directions = ["N", "E", "S", "W"];
    const moveWaypoint = (direction, distance) => {
      if (direction === "N") {
        waypointY += distance;
      } else if (direction === "S") {
        waypointY -= distance;
      } else if (direction === "W") {
        waypointX -= distance;
      } else if (direction === "E") {
        waypointX += distance;
      }
    };
    commands.forEach((c) => {
      if (directions.includes(c[0])) {
        moveWaypoint(c[0], c[1]);
      } else if (c[0] === "L") {
        const shift = c[1] / 90;

        // 1,2 => -2,1 => -1,-2 => 2,-1 => 1, 2
        for (let i = 0; i < shift; i++) {
          const wasX = waypointX;
          const wasY = waypointY;
          waypointX = -wasY;
          waypointY = wasX;
        }
      } else if (c[0] === "R") {
        const shift = c[1] / 90;
        // 1,2 => 2,-1 => -1,-2 => -2,1 => 1, 2
        for (let i = 0; i < shift; i++) {
          const wasX = waypointX;
          const wasY = waypointY;
          waypointX = wasY;
          waypointY = -wasX;
        }
      } else if (c[0] === "F") {
        shipX += c[1] * waypointX;
        shipY += c[1] * waypointY;
      }
      console.log(facing, shipX, shipY, waypointX, waypointY);
    });

    postMessage(
      {
        command: "RESULT",
        result: Math.abs(shipX) + Math.abs(shipY),
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
