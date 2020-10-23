import resolvePath from "./resolvePath";

describe("ResolvePath", () => {
  test("should throw error when path is length 9", () => {
    const PATH_LENGTH = 9;
    expect(() =>
      resolvePath({
        path: new Array(PATH_LENGTH).fill(0),
        options: {}
      })
    ).toThrowError(
      Error(
        `You cannot traverse more than 10 layers deep! Please reduce the amount of nesting in your document.`
      )
    );
  });

  test("should resolve path for Record -> List -> String", () => {
    expect(
      resolvePath({
        path: ["values", 0],
        options: {
          type: "Record",
          path: [],
          fields: [
            {
              label: "Name",
              value: {
                type: "List",
                path: ["values"],
                items: [{ type: "String", path: ["values", 0], value: "A" }]
              }
            }
          ]
        }
      })
    ).toEqual({
      options: { type: "String", path: ["values", 0], value: "A" }
    });
  });

  test("should resolve path for Record -> List -> List -> String", () => {
    expect(
      resolvePath({
        path: ["values", 0, 0],
        options: {
          type: "Record",
          path: [],
          fields: [
            {
              label: "Name",
              value: {
                type: "List",
                path: ["values"],
                items: [
                  {
                    type: "List",
                    path: ["values", 0],
                    items: [
                      {
                        type: "String",
                        path: ["values", 0, 0],
                        value: "second A"
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      })
    ).toEqual({
      options: {
        type: "String",
        path: ["values", 0, 0],
        value: "second A"
      }
    });
  });

  test("should resolve path for Record -> String", () => {
    expect(
      resolvePath({
        path: ["values"],
        options: {
          type: "Record",
          path: [],
          fields: [
            {
              label: "Name",
              value: {
                type: "String",
                path: ["values"],
                value: "A"
              }
            }
          ]
        }
      })
    ).toEqual({
      options: {
        type: "String",
        path: ["values"],
        value: "A"
      }
    });
  });

  test("should resolve path for Record -> Record -> String", () => {
    expect(
      resolvePath({
        path: ["records", "values"],
        options: {
          type: "Record",
          path: [],
          fields: [
            {
              label: "Name",
              value: {
                type: "Record",
                path: ["records"],
                fields: [
                  {
                    label: "Name",
                    value: {
                      type: "String",
                      path: ["records", "values"],
                      value: "A"
                    }
                  }
                ]
              }
            }
          ]
        }
      })
    ).toEqual({
      options: {
        type: "String",
        path: ["records", "values"],
        value: "A"
      }
    });
  });

  test.todo("Error cases");
});
