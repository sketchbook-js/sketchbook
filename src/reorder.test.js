import reorder from "./reorder";

describe("Reorder", () => {
  const testList = ["a", "b", "c", "d"];

  test("single element, leadIndex < endIndex", () => {
    expect(reorder(testList, 1, 3)).toEqual(["a", "c", "d", "b"]);
  });

  test("single element, leadIndex > endIndex", () => {
    expect(reorder(testList, 3, 1)).toEqual(["a", "d", "b", "c"]);
  });

  test("single element, reorders 1 element correctly leadIndex === endIndex", () => {
    expect(reorder(testList, 2, 2)).toEqual(testList);
  });

  test("consecutive elements, move to end", () => {
    expect(reorder(["a", "b", "c"], [0, 1], 1)).toEqual(["c", "a", "b"]);
  });

  test("consecutive elements reordered, move to end", () => {
    expect(reorder(["a", "b", "c"], [1, 0], 1)).toEqual(["c", "b", "a"]);
  });

  test("multiple elements, move to start", () => {
    expect(reorder(["a", "b", "c", "d"], [0, 3], 0)).toEqual([
      "a",
      "d",
      "b",
      "c"
    ]);
  });

  test("multiple elements, move to middle", () => {
    expect(reorder(["a", "b", "c", "d"], [0, 3], 1)).toEqual([
      "b",
      "a",
      "d",
      "c"
    ]);
  });

  test("multiple elements, move to end", () => {
    expect(reorder(["a", "b", "c", "d"], [0, 3], 2)).toEqual([
      "b",
      "c",
      "a",
      "d"
    ]);
  });

  test("multiple elements, secondElementIndex > leadIndex && secondElementIndex > endIndex", () => {
    expect(reorder(["a", "b", "c", "d"], [0, 3], 2)).toEqual([
      "b",
      "c",
      "a",
      "d"
    ]);
  });

  test("multiple elements, secondElementIndex < leadIndex && secondElementIndex < endIndex", () => {
    expect(reorder(["a", "b", "c", "d"], [3, 0], 2)).toEqual([
      "b",
      "c",
      "d",
      "a"
    ]);
  });

  test("multiple elements, secondElemIndex < leadIndex && secondElemIndex >= endIndex", () => {
    expect(reorder(["a", "b", "c", "d"], [3, 1], 0)).toEqual([
      "d",
      "b",
      "a",
      "c"
    ]);
  });

  test("multiple elements, secondElemIndex > leadIndex && secondElemIndex <= endIndex", () => {
    expect(reorder(["a", "b", "c", "d"], [1, 2], 3)).toEqual([
      "a",
      "d",
      "b",
      "c"
    ]);
  });
});
