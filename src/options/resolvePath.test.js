import resolvePath from "./resolvePath";

describe("ResolvePath", () => {
  test("should throw error when path is length 9", () => {
    const PATH_LENGTH = 9;
    expect(() =>
      resolvePath(new Array(PATH_LENGTH).fill(0), {
        config: {},
        value: "",
        depth: 0
      })
    ).toThrowError(
      Error(
        "Your document has is nested more than 10 times! Reduce the amount of nesting."
      )
    );
  });

  test("should throw error when config type is not record and path length is not 0", () => {
    expect(() =>
      resolvePath([0, 0], {
        config: {
          type: "List",
          inputs: {
            type: "String"
          }
        },
        value: ["Example A", "Example B", "Example C"],
        depth: 0
      })
    ).toThrowError(Error("Can't resolve path."));
  });

  test("should resolve path for List -> String, displaying the string", () => {
    expect(
      resolvePath([0], {
        config: {
          type: "List",
          inputs: {
            type: "String"
          }
        },
        value: ["Example A", "Example B", "Example C"],
        depth: 0
      })
    ).toEqual({
      config: { type: "String" },
      value: "Example A",
      depth: 1
    });
  });

  test("should resolve path for List -> List", () => {
    expect(
      resolvePath([0], {
        config: {
          type: "List",
          inputs: {
            type: "List",
            inputs: {
              type: "String"
            }
          }
        },
        value: [["a", "b"]],
        depth: 0
      })
    ).toEqual({
      config: {
        inputs: {
          type: "String"
        },
        type: "List"
      },
      value: ["a", "b"],
      depth: 1
    });
  });

  test("should resolve path for List -> List -> String", () => {
    expect(
      resolvePath([0, 1], {
        config: {
          type: "List",
          inputs: {
            type: "List",
            inputs: {
              type: "String"
            }
          }
        },
        value: [["a", "b"]],
        depth: 0
      })
    ).toEqual({
      config: {
        type: "String"
      },
      value: "b",
      depth: 2
    });
  });

  test("should resolve path for Record -> Record", () => {
    expect(
      resolvePath(["website"], {
        config: {
          type: "Record",
          fields: [
            {
              key: "website",
              label: "Links",
              input: {
                type: "Record",
                fields: [
                  {
                    key: "url",
                    label: "URL",
                    input: {
                      type: "String"
                    }
                  },
                  {
                    key: "text",
                    label: "Text",
                    input: {
                      type: "String"
                    }
                  }
                ]
              }
            }
          ]
        },
        value: {
          website: {
            url: "https://example.com",
            text: "example"
          }
        },
        depth: 0
      })
    ).toEqual({
      config: {
        type: "Record",
        fields: [
          {
            key: "url",
            label: "URL",
            input: {
              type: "String"
            }
          },
          {
            key: "text",
            label: "Text",
            input: {
              type: "String"
            }
          }
        ]
      },
      value: {
        url: "https://example.com",
        text: "example"
      },
      depth: 1
    });
  });

  test("should resolve path for Record -> Record -> String", () => {
    expect(
      resolvePath(["website", "url"], {
        config: {
          type: "Record",
          fields: [
            {
              key: "website",
              label: "Links",
              input: {
                type: "Record",
                fields: [
                  {
                    key: "url",
                    label: "URL",
                    input: {
                      type: "String"
                    }
                  },
                  {
                    key: "text",
                    label: "Text",
                    input: {
                      type: "String"
                    }
                  }
                ]
              }
            }
          ]
        },
        value: {
          website: {
            url: "https://example.com",
            text: "example"
          }
        },
        depth: 0
      })
    ).toEqual({
      config: {
        type: "String"
      },
      value: "https://example.com",
      depth: 2
    });
  });
});
