import { h } from "preact";
import { useState } from "preact/hooks";
import { Block, InlineBlock, Col, Row } from "jsxstyle/preact";

const inputs = {
  //@ts-ignore
  1: import("../days/1/input.txt"),
};

const workers = {
  "1.1": new Worker("../days/1/part1.ts"),
  "1.2": new Worker("../days/1/part2.ts"),
};

const Day = ({ day }) => {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const start = async (part) => {
    if (isRunning) {
      return;
    }
    console.log("Starting");
    setIsRunning(true);
    setResult(null);
    const worker = workers[`${day}.${part}`];
    // const worker = new Worker(`../days/${day}/part${part}.js`);
    // const worker = (() => {
    //   if (day === "1" && part === "1") {
    //     return new Worker("../days/1/part1.js");
    //   }
    // })();
    worker.onmessage = (e) => {
      // console.log("Messag from worker", e);
      const { command } = e.data;
      if (command === "RESULT") {
        console.log("Result", e.data.result);
        setResult(e.data.result);
        setProgress(1);
        setIsRunning(false);
      } else if (command === "PROGRESS") {
        const { complete, total } = e.data;
        // console.log("Progress", complete / total);
        setProgress(complete / total);
      }
    };

    const input = (await inputs[day]).default;
    worker.postMessage({ command: "START", input });
  };

  return (
    <Col border="1px solid black" padding="2rem" alignItems="center">
      <Block fontWeight={500} fontSize="2rem" marginBottom="1rem">
        Day {day}
      </Block>
      {result !== null ? (
        <pre>{result}</pre>
      ) : isRunning ? (
        <InlineBlock
          component="progress"
          width="100%"
          margin="2px 0"
          props={{
            max: 1,
            value: progress ? progress.toString() : undefined,
          }}
        />
      ) : null}
      <Row marginTop="1rem">
        <InlineBlock
          component="button"
          margin="0 auto"
          marginRight="0.5rem"
          props={{ onClick: () => start("1") }}
        >
          Part 1
        </InlineBlock>
        <InlineBlock
          component="button"
          margin="0 auto"
          props={{ onClick: () => start("2") }}
        >
          Part 2
        </InlineBlock>
      </Row>
    </Col>
  );
};

export default Day;
