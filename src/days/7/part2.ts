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

    const countContents = (r: Rule) =>
      Object.keys(r.contents).reduce(
        (sum, k) => sum + r.contents[k] * (1 + countContents(rules[k])),
        0
      );
    const totalBags = countContents(rules["shiny gold"]);

    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );

    postMessage({ command: "RESULT", result: totalBags }, null);
  }
};

console.log("Worker loaded");
