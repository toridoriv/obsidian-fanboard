import { describe, expect, it } from "../tests/deps.ts";
import { DateUtils } from "./date.ts";

describe("the function DateUtils.createTimestamp", () => {
  it("should create a timestamp in the expected format", () => {
    const date = new Date("2012/12/21 00:00:00.000");
    const expectedOutput = "2012-12-21T00:00:00";
    const result = DateUtils.createTimestamp(date);

    expect(result).to.equal(expectedOutput);
  });
});
