import _ from "lodash";

type SeatMap = ("." | "L" | "#")[];
// type SeatMap = string;

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines: SeatMap[] = input.split("\n");
    console.log(`${lines.length} lines of input`);

    const rowLength = lines[0].length;
    const rows: SeatMap = (lines.join("").split("") as unknown) as SeatMap;

    const seatAt = (rows, y, x) =>
      x < 0 || x >= rowLength
        ? "."
        : y < 0 || y >= lines.length
        ? "."
        : rows[y * rowLength + x];
    const setSeatAt = (rows, y, x, value) => rows[y * rowLength + x] - value;
    const adjacentCount = (rows, y, x) =>
      (seatAt(rows, y - 1, x) === "#" ? 1 : 0) +
      (seatAt(rows, y + 1, x) === "#" ? 1 : 0) +
      (seatAt(rows, y - 1, x - 1) === "#" ? 1 : 0) +
      (seatAt(rows, y - 1, x + 1) === "#" ? 1 : 0) +
      (seatAt(rows, y + 1, x - 1) === "#" ? 1 : 0) +
      (seatAt(rows, y + 1, x + 1) === "#" ? 1 : 0) +
      (seatAt(rows, y, x - 1) === "#" ? 1 : 0) +
      (seatAt(rows, y, x + 1) === "#" ? 1 : 0);

    const round = (rows) => {
      const updatedRows: SeatMap = [...rows];
      for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < rowLength; x++) {
          if (seatAt(rows, y, x) === "L" && adjacentCount(rows, y, x) === 0) {
            updatedRows[y * rowLength + x] = "#";
          } else if (
            seatAt(rows, y, x) === "#" &&
            adjacentCount(rows, y, x) >= 4
          ) {
            updatedRows[y * rowLength + x] = "L";
          }
        }
      }
      return updatedRows;
    };

    let lastRound = rows;
    let rounds = 0;
    while (true) {
      // debugger;
      const newRound = round(lastRound);
      // console.log(rounds);
      // console.table(newRound);
      // debugger;
      if (newRound.join("") === lastRound.join("")) {
        debugger;
        postMessage(
          {
            command: "RESULT",
            result: newRound.filter((s) => s === "#").length,
          },
          null
        );
        return;
      }
      rounds++;
      lastRound = newRound;
    }

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );
  }
};

console.log("Worker loaded");
