import reorder from "./reorder";

describe("Reorder", () => {
  const testList = ["a", "b", "c", "d"];

  test("start index does not exist in list", () => {
    expect(reorder(testList, 4, 1)).toEqual(testList);
  });

  test("end index does not exist in list", () => {
    expect(reorder(testList, 1, 4)).toEqual(testList);
  });

  test("reorders 1 element correctly start index < end index", () => {
    expect(reorder(testList, 1, 3)).toEqual(["a", "c", "d", "b"]);
  });

  test("reorders 1 element correctly end index < start index", () => {
    expect(reorder(testList, 3, 1)).toEqual(["a", "d", "b", "c"]);
  });

  test("reorders 1 element correctly start index === end index", () => {
    expect(reorder(testList, 2, 2)).toEqual(testList);
  });

  test("reorders 1 element when only one predicate is specified", () => {
    expect(reorder(testList, 1, 3, () => true)).toEqual(["a", "c", "d", "b"]);
    expect(reorder(testList, 1, 3, null, () => true)).toEqual([
      "a",
      "c",
      "d",
      "b"
    ]);
  });

  test("reorders multiple elements correctly", () => {
    expect(
      reorder(
        testList,
        1,
        3,
        elem => ["c", "d"].includes(elem),
        elem => ["a", "b"].includes(elem)
      )
    ).toEqual(["c", "a", "b", "d"]);
  });

  test("predicates cause filter array to return an overlapping value", () => {
    expect(
      reorder(
        testList,
        1,
        3,
        elem => ["b", "c", "d"].includes(elem),
        elem => ["a", "b"].includes(elem)
      )
    ).toEqual("invalid predicate(s)");
  });
});
