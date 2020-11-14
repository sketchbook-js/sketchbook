import reconcileOptions from "./reconcileOptions";

describe("reconcileOptions", () => {
  test("complete example", () => {
    expect(
      reconcileOptions(
        {
          type: "Record",
          fields: [
            { key: "name", label: "Name", input: { type: "String" } },
            {
              key: "teams",
              label: "Teams",
              input: { type: "List", inputs: { type: "String" } }
            }
          ]
        },
        {
          name: "Jane Doe",
          teams: ["Sales", "Marketing"]
        }
      )
    ).toEqual({
      type: "Record",
      path: [],
      fields: [
        {
          label: "Name",
          value: {
            type: "String",
            path: ["name"],
            value: "Jane Doe"
          }
        },
        {
          label: "Teams",
          value: {
            type: "List",
            path: ["teams"],
            items: [
              { type: "String", path: ["teams", 0], value: "Sales" },
              { type: "String", path: ["teams", 1], value: "Marketing" }
            ]
          }
        }
      ]
    });
  });

  test("throw error if config missing or has invalid type", () => {
    expect(() => {
      reconcileOptions(null, {});
    }).toThrowError();
    expect(() => {
      reconcileOptions(false, {});
    }).toThrowError();
    expect(() => {
      reconcileOptions("foo", {});
    }).toThrowError();
    expect(() => {
      reconcileOptions({}, {});
    }).toThrowError();
    expect(() => {
      reconcileOptions({ type: false }, {});
    }).toThrowError();
    expect(() => {
      reconcileOptions({ type: "Foo" }, {});
    }).toThrowError();
  });

  describe("Record option", () => {
    test.todo("base case");
    test.todo("throw error if config is invalid");
    test.todo("throw error if value is invalid");
  });

  describe("List option", () => {
    test("base case", () => {
      expect(
        reconcileOptions({ type: "List", inputs: { type: "String" } }, [])
      ).toEqual({
        type: "List",
        path: [],
        items: []
      });
    });
    test.todo("throw error if value is invalid");
  });

  describe("String option", () => {
    test("base case", () => {
      expect(reconcileOptions({ type: "String" }, "abc")).toEqual({
        type: "String",
        path: [],
        value: "abc"
      });
    });
    test("throw error if value is invalid", () => {
      expect(() => {
        reconcileOptions({ type: "String" }, null);
      }).toThrowError();
    });
  });

  describe("PlainText option", () => {
    test.todo("base case");
    test.todo("throw error if value is invalid");
  });

  describe("Checkbox option", () => {
    test.todo("base case");
    test.todo("throw error if value is invalid");
  });

  describe("Checkboxes option", () => {
    test.todo("base case");
    test.todo("throw error if config is invalid");
    test.todo("throw error if value is invalid");
  });
});
