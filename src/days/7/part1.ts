import _ from "lodash";

type Rule = {
  container: string;
  contents: { [key: string]: number };
};

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n");
    console.log(`${lines.length} lines of input`);

    const parseLine = (line: string) => {
      const container = line.match(/([a-z ]+) bags contain/)[1];
      const contents = [...line.matchAll(/(\d+) ([a-z ]+) bags?/g)].reduce(
        (acc, m) => ({ ...acc, [m[2]]: parseInt(m[1]) }),
        {}
      );

      return { container, contents } as Rule;
    };

    const rules: { [key: string]: Rule } = _.keyBy(
      lines.map(parseLine),
      "container"
    );

    const hasGold = (r: Rule) =>
      Object.keys(r.contents).includes("shiny gold") ||
      Object.keys(r.contents).reduce(
        (acc, c) => acc || hasGold(rules[c]),
        false
      );
    const containsGold = Object.values(rules).filter(hasGold);

    console.log(containsGold);

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );

    postMessage({ command: "RESULT", result: containsGold.length }, null);
  }
};

console.log("Worker loaded");
