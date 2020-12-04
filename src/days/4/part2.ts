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
      const values = fields.map((f) => f.split(":").pop());
      const data = _.zipObject(keys, values);

      const requiredKeys = ["ecl", "pid", "eyr", "hcl", "iyr", "hgt", "byr"];
      const validations = {
        byr: (v) => parseInt(v) >= 1920 && parseInt(v) <= 2002,
        iyr: (v) => parseInt(v) >= 2010 && parseInt(v) <= 2020,
        eyr: (v) => parseInt(v) >= 2020 && parseInt(v) <= 2030,
        hgt: (v) =>
          v.slice(-2) === "in"
            ? parseInt(v) >= 59 && parseInt(v) <= 76
            : v.slice(-2) === "cm"
            ? parseInt(v) >= 150 && parseInt(v) <= 193
            : false,
        hcl: (v) => v.length === 7 && /\#[0-9a-f]{6}/.test(v),
        ecl: (v) =>
          ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(v),
        pid: (v) => v.length === 9 && /[0-9]{9}/.test(v),
      };
      const isValid = requiredKeys.reduce(
        (valid, key) => valid && data[key] && validations[key](data[key]),
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
