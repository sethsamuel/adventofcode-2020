import _ from "lodash";

self.onmessage = async (e) => {
  console.log("Message received", e);
  const { command, input } = e.data;
  if (command === "START") {
    const lines = input.split("\n\n");
    console.log(`${lines.length} lines of input`);

    const passports = lines.filter(Boolean);
    const valid = passports.reduce((sum, passport) => {
      const fields = passport.split(/[ \n]/);
      const keys = fields.map((f) => f.split(":").shift());

      const requiredKeys = ["ecl", "pid", "eyr", "hcl", "iyr", "hgt", "byr"];
      const isValid = requiredKeys.reduce(
        (valid, key) => valid && keys.includes(key),
        true
      );
      if (isValid) {
        return sum + 1;
      }
      return sum;
    }, 0);
    // postMessage(
    //   { command: "PROGRESS", complete: i, total: lines.length },
    //   null
    // );

    postMessage({ command: "RESULT", result: valid }, null);
  }
};

console.log("Worker loaded");
