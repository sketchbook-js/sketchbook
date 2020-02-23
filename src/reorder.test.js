import reorder from "./reorder";

describe("Reorder", () => {
  const testList = ["a", "b", "c", "d"];

  test("startIndex does not exist in list", () => {
    expect(reorder(testList, 4, 1)).toEqual(testList);
  });

  test("endIndex does not exist in list should fail", () => {
    expect(reorder(testList, 1, 4)).toEqual(testList);
  });

  test("single element, leadIndex < endIndex", () => {
    expect(reorder(testList, 1, 3)).toEqual(["a", "c", "d", "b"]);
  });

  test("single element, leadIndex > endIndex", () => {
    expect(reorder(testList, 3, 1)).toEqual(["a", "d", "b", "c"]);
  });

  test("single element, reorders 1 element correctly leadIndex === endIndex", () => {
    expect(reorder(testList, 2, 2)).toEqual(testList);
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
      "d",
      "a",
      "c"
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

  test("ignore duplicates", () => {
    expect(reorder(["a", "b", "c", "d"], [0, 0], 3)).toEqual([
      "b",
      "c",
      "d",
      "a"
    ]);
  });
});
