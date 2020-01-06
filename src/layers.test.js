import {
  transformLayers,
  alignLayers,
  getLayerBounds,
  transformBounds,
  transformPoints
} from "./layers";

describe("transformLayers", () => {
  test("no layers no-op", () => {
    expect(transformLayers([], {})).toEqual([]);
  });

  test("single layer no-op", () => {
    expect(
      transformLayers(
        [
          {
            x1: 0,
            y1: 0,
            x2: 100,
            y2: 100
          }
        ],
        {}
      )
    ).toEqual([
      {
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 100
      }
    ]);
  });

  test("multiple layers no-op", () => {
    expect(
      transformLayers(
        [
          {
            x1: 0,
            y1: 0,
            x2: 50,
            y2: 50
          },
          {
            x1: 50,
            y1: 50,
            x2: 100,
            y2: 100
          }
        ],
        {}
      )
    ).toEqual([
      {
        x1: 0,
        y1: 0,
        x2: 50,
        y2: 50
      },
      {
        x1: 50,
        y1: 50,
        x2: 100,
        y2: 100
      }
    ]);
  });

  test("multiple layers translating", () => {
    expect(
      transformLayers(
        [
          {
            x1: 0,
            y1: 0,
            x2: 50,
            y2: 50
          },
          {
            x1: 50,
            y1: 50,
            x2: 100,
            y2: 100
          }
        ],
        {
          x: 100,
          y: 100
        }
      )
    ).toEqual([
      {
        x1: 100,
        y1: 100,
        x2: 150,
        y2: 150
      },
      {
        x1: 150,
        y1: 150,
        x2: 200,
        y2: 200
      }
    ]);
  });

  test("multiple layers scaling", () => {
    expect(
      transformLayers(
        [
          {
            x1: 0,
            y1: 0,
            x2: 50,
            y2: 50
          },
          {
            x1: 50,
            y1: 50,
            x2: 100,
            y2: 100
          }
        ],
        {
          w: 260,
          h: 260
        }
      )
    ).toEqual([
      {
        x1: 0,
        y1: 0,
        x2: 130,
        y2: 130
      },
      {
        x1: 130,
        y1: 130,
        x2: 260,
        y2: 260
      }
    ]);
  });

  test("multiple layers translating and scaling", () => {
    expect(
      transformLayers(
        [
          {
            x1: 0,
            y1: 0,
            x2: 50,
            y2: 50
          },
          {
            x1: 50,
            y1: 50,
            x2: 100,
            y2: 100
          }
        ],
        {
          x: 200,
          y: 200,
          w: 240,
          h: 240
        }
      )
    ).toEqual([
      {
        x1: 200,
        y1: 200,
        x2: 320,
        y2: 320
      },
      {
        x1: 320,
        y1: 320,
        x2: 440,
        y2: 440
      }
    ]);
  });

  test("single layer positivly offset from 0 scaling", () => {
    expect(
      transformLayers(
        [
          {
            x1: 130,
            y1: 130,
            x2: 400,
            y2: 400
          }
        ],
        {
          w: 25,
          h: 25
        }
      )
    ).toEqual([
      {
        x1: 130,
        y1: 130,
        x2: 155,
        y2: 155
      }
    ]);
  });

  test("multiple layers positivly offset from 0 scaling", () => {
    expect(
      transformLayers(
        [
          {
            x1: 130,
            y1: 130,
            x2: 400,
            y2: 400
          },
          {
            x1: 400,
            y1: 400,
            x2: 430,
            y2: 430
          }
        ],
        {
          w: 150
        }
      )
    ).toEqual([
      {
        x1: 130,
        y1: 130,
        x2: 265,
        y2: 400
      },
      {
        x1: 265,
        y1: 400,
        x2: 280,
        y2: 430
      }
    ]);
  });

  test.todo("predicate");
});

describe("getLayerBounds", () => {
  test("no layers", () => {
    expect(getLayerBounds([])).toEqual({
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    });
  });

  test("single layer", () => {
    expect(
      getLayerBounds([
        {
          x1: 0,
          y1: 0,
          x2: 100,
          y2: 100
        }
      ])
    ).toEqual({
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100
    });
  });

  test("multiple layers", () => {
    expect(
      getLayerBounds([
        {
          x1: 0,
          y1: 0,
          x2: 50,
          y2: 50
        },
        {
          x1: 50,
          y1: 50,
          x2: 100,
          y2: 100
        }
      ])
    ).toEqual({
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100
    });
  });

  test("multiple layers positivly offset from 0", () => {
    expect(
      getLayerBounds([
        {
          x1: 100,
          y1: 100,
          x2: 150,
          y2: 150
        },
        {
          x1: 150,
          y1: 150,
          x2: 200,
          y2: 200
        }
      ])
    ).toEqual({
      x1: 100,
      y1: 100,
      x2: 200,
      y2: 200
    });
  });

  test("multiple layers negativly offset from 0", () => {
    expect(
      getLayerBounds([
        {
          x1: -200,
          y1: -200,
          x2: -150,
          y2: -150
        },
        {
          x1: -150,
          y1: -150,
          x2: -100,
          y2: -100
        }
      ])
    ).toEqual({
      x1: -200,
      y1: -200,
      x2: -100,
      y2: -100
    });
  });

  test.todo("inverted x and y");

  test.todo("predicate");
});

describe("transformBounds", () => {
  test("no-op", () => {
    expect(transformBounds([], { x1: 90, y1: 90, x2: 240, y2: 240 })).toEqual({
      x1: 90,
      y1: 90,
      x2: 240,
      y2: 240
    });
  });

  test("identity", () => {
    expect(
      transformBounds(
        [
          {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0
          }
        ],
        {
          x1: 90,
          y1: 90,
          x2: 240,
          y2: 240
        }
      )
    ).toEqual({
      x1: 90,
      y1: 90,
      x2: 240,
      y2: 240
    });
  });

  test("translate", () => {
    expect(
      transformBounds(
        [
          {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 100,
            f: 100
          }
        ],
        {
          x1: 90,
          y1: 90,
          x2: 240,
          y2: 240
        }
      )
    ).toEqual({
      x1: 190,
      y1: 190,
      x2: 340,
      y2: 340
    });
  });

  test("scale", () => {
    expect(
      transformBounds(
        [
          {
            a: 2,
            b: 0,
            c: 0,
            d: 2,
            e: 0,
            f: 0
          }
        ],
        {
          x1: 90,
          y1: 90,
          x2: 240,
          y2: 240
        }
      )
    ).toEqual({
      x1: 180,
      y1: 180,
      x2: 480,
      y2: 480
    });
  });

  test.todo("round");
});

describe("transformPoints", () => {
  test("no-op, no points", () => {
    expect(transformPoints([], [])).toEqual([]);
  });

  test("no-op, multiple points", () => {
    expect(transformPoints([], [[45, 23], [23, 11]])).toEqual([
      [45, 23],
      [23, 11]
    ]);
  });

  test("identity, multiple points", () => {
    expect(
      transformPoints(
        [
          {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0
          }
        ],
        [[45, 23], [23, 11]]
      )
    ).toEqual([[45, 23], [23, 11]]);
  });

  test("translate, multiple points", () => {
    expect(
      transformPoints(
        [
          {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: -50,
            f: -25
          }
        ],
        [[45, 23], [23, 11]]
      )
    ).toEqual([[-5, -2], [-27, -14]]);
  });

  test("translate and scale, multiple points", () => {
    expect(
      transformPoints(
        [
          {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: -50,
            f: -25
          },
          {
            a: 2,
            b: 0,
            c: 0,
            d: 2,
            e: 0,
            f: 0
          }
        ],
        [[45, 23], [23, 11]]
      )
    ).toEqual([[-10, -4], [-54, -28]]);
  });
});
