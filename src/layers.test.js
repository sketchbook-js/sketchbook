import {
  transformLayers,
  alignLayers,
  getLayerBounds,
  transformBounds,
  transformPoints,
  getExtremeBounds,
  resizeLayersToExtreme
} from "./layers";

describe("transformLayers", () => {
  test("no layers, no-op", () => {
    expect(transformLayers([], {})).toEqual([]);
  });

  test("single layer, no-op", () => {
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

  test("multiple layers, no-op", () => {
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

  test("multiple layers, translating", () => {
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

  test("multiple layers, scaling", () => {
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

  test("multiple layers, translating and scaling", () => {
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

  test("single layer, positivly offset from 0, scaling", () => {
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

  test("multiple layers, positivly offset from 0, scaling", () => {
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

  test("multiple layers, positivly offset from 0, scaling, origin middle-right", () => {
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
          w: 150,
          cx: 1
        }
      )
    ).toEqual([
      {
        x1: 280,
        y1: 130,
        x2: 415,
        y2: 400
      },
      {
        x1: 415,
        y1: 400,
        x2: 430,
        y2: 430
      }
    ]);
  });

  test("multiple layers, negativly offset from 0, scaling, origin middle-right, relative", () => {
    expect(
      transformLayers(
        [
          {
            x1: -70,
            y1: -70,
            x2: 200,
            y2: 200
          },
          {
            x1: 200,
            y1: 200,
            x2: 230,
            y2: 230
          }
        ],
        {
          w: -150,
          cx: 1,
          relative: true
        }
      )
    ).toEqual([
      {
        x1: 80,
        y1: -70,
        x2: 215,
        y2: 200
      },
      {
        x1: 215,
        y1: 200,
        x2: 230,
        y2: 230
      }
    ]);
  });

  test.todo("predicate");
});

describe("alignLayers", () => {
  test("align vertical top", () => {
    expect(
      alignLayers(
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
        { y: -1 }
      )
    ).toEqual([
      {
        x1: 130,
        y1: 130,
        x2: 400,
        y2: 400
      },
      {
        x1: 400,
        y1: 130,
        x2: 430,
        y2: 160
      }
    ]);
  });

  test("align vertical center", () => {
    expect(
      alignLayers(
        [
          {
            x1: 130,
            y1: 130,
            x2: 400,
            y2: 410
          },
          {
            x1: 400,
            y1: 400,
            x2: 430,
            y2: 440
          }
        ],
        { y: 0 }
      )
    ).toEqual([
      {
        x1: 130,
        y1: 145,
        x2: 400,
        y2: 425
      },
      {
        x1: 400,
        y1: 265,
        x2: 430,
        y2: 305
      }
    ]);
  });

  test("align vertical bottom", () => {
    expect(
      alignLayers(
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
        { y: 1 }
      )
    ).toEqual([
      {
        x1: 130,
        y1: 160,
        x2: 400,
        y2: 430
      },
      {
        x1: 400,
        y1: 400,
        x2: 430,
        y2: 430
      }
    ]);
  });

  test("align horizontal left", () => {
    expect(
      alignLayers(
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
        { x: -1 }
      )
    ).toEqual([
      {
        x1: 130,
        y1: 130,
        x2: 400,
        y2: 400
      },
      {
        x1: 130,
        y1: 400,
        x2: 160,
        y2: 430
      }
    ]);
  });

  test("align horizontal center", () => {
    expect(
      alignLayers(
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
        { x: 0 }
      )
    ).toEqual([
      {
        x1: 145,
        y1: 130,
        x2: 415,
        y2: 400
      },
      {
        x1: 265,
        y1: 400,
        x2: 295,
        y2: 430
      }
    ]);
  });

  test("align horizontal right", () => {
    expect(
      alignLayers(
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
        { x: 1 }
      )
    ).toEqual([
      {
        x1: 160,
        y1: 130,
        x2: 430,
        y2: 400
      },
      {
        x1: 400,
        y1: 400,
        x2: 430,
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
});

describe("transformPoints", () => {
  test("no-op, no points", () => {
    expect(transformPoints([], [])).toEqual([]);
  });

  test("no-op, multiple points", () => {
    expect(
      transformPoints(
        [],
        [
          [45, 23],
          [23, 11]
        ]
      )
    ).toEqual([
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
        [
          [45, 23],
          [23, 11]
        ]
      )
    ).toEqual([
      [45, 23],
      [23, 11]
    ]);
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
        [
          [45, 23],
          [23, 11]
        ]
      )
    ).toEqual([
      [-5, -2],
      [-27, -14]
    ]);
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
        [
          [45, 23],
          [23, 11]
        ]
      )
    ).toEqual([
      [-10, -4],
      [-54, -28]
    ]);
  });
});

describe("GetExtremeBounds", () => {
  const layers = [
    {
      id: "-LyqdJBMdrVihqnJOOo8",
      name: "Input",
      component: "Input",
      x1: 100,
      y1: 666,
      x2: 500,
      y2: 722,
      options: { label: "Email", value: "" }
    },
    {
      id: "-LyqdsUuufs_UM05V3My",
      name: "Button",
      component: "Button",
      x1: 400,
      y1: 732,
      x2: 500,
      y2: 768,
      options: { label: "Subscribe" }
    }
  ];

  test("no extreme", () => {
    expect(getExtremeBounds(layers, null)).toEqual(null);
  });

  test("no layers", () => {
    expect(getExtremeBounds([], "widest")).toEqual(null);
  });

  test("find widest bounds", () => {
    expect(getExtremeBounds(layers, "widest")).toEqual({ x1: 100, x2: 500 });
  });

  test("find narrowest bounds", () => {
    expect(getExtremeBounds(layers, "narrowest")).toEqual({ x1: 400, x2: 500 });
  });

  test("find tallest bounds", () => {
    expect(getExtremeBounds(layers, "tallest")).toEqual({ y1: 666, y2: 722 });
  });

  test("find shortest bounds", () => {
    expect(getExtremeBounds(layers, "shortest")).toEqual({ y1: 732, y2: 768 });
  });

  test.todo("predicate");
});

describe("ResizeLayersToExtreme", () => {
  const layers = [
    {
      id: "-LyqdJBMdrVihqnJOOo8",
      name: "Input",
      component: "Input",
      x1: 100,
      y1: 666,
      x2: 500,
      y2: 722,
      options: { label: "Email", value: "" }
    },
    {
      id: "-LyqduQ0G84esGuBLiC4",
      name: "Image",
      component: "Image",
      x1: 100,
      y1: 156,
      x2: 340,
      y2: 336
    }
  ];

  test("no layers", () => {
    expect(resizeLayersToExtreme([], "widest")).toEqual([]);
  });

  test("no extreme", () => {
    expect(resizeLayersToExtreme(layers, null)).toEqual(layers);
  });

  test("resize layers to widest", () => {
    expect(resizeLayersToExtreme(layers, "widest")).toEqual([
      {
        id: "-LyqdJBMdrVihqnJOOo8",
        name: "Input",
        component: "Input",
        x1: 100,
        y1: 666,
        x2: 500,
        y2: 722,
        options: { label: "Email", value: "" }
      },
      {
        id: "-LyqduQ0G84esGuBLiC4",
        name: "Image",
        component: "Image",
        x1: 100,
        y1: 156,
        x2: 500,
        y2: 336
      }
    ]);
  });

  test("resize layers to narrowest", () => {
    expect(resizeLayersToExtreme(layers, "narrowest")).toEqual([
      {
        id: "-LyqdJBMdrVihqnJOOo8",
        name: "Input",
        component: "Input",
        x1: 100,
        y1: 666,
        x2: 340,
        y2: 722,
        options: { label: "Email", value: "" }
      },
      {
        id: "-LyqduQ0G84esGuBLiC4",
        name: "Image",
        component: "Image",
        x1: 100,
        y1: 156,
        x2: 340,
        y2: 336
      }
    ]);
  });

  test("resize layers to tallest", () => {
    expect(resizeLayersToExtreme(layers, "tallest")).toEqual([
      {
        id: "-LyqdJBMdrVihqnJOOo8",
        name: "Input",
        component: "Input",
        x1: 100,
        y1: 156,
        x2: 500,
        y2: 336,
        options: { label: "Email", value: "" }
      },
      {
        id: "-LyqduQ0G84esGuBLiC4",
        name: "Image",
        component: "Image",
        x1: 100,
        y1: 156,
        x2: 340,
        y2: 336
      }
    ]);
  });

  test("resize layers to shortest", () => {
    expect(resizeLayersToExtreme(layers, "shortest")).toEqual([
      {
        id: "-LyqdJBMdrVihqnJOOo8",
        name: "Input",
        component: "Input",
        x1: 100,
        y1: 666,
        x2: 500,
        y2: 722,
        options: { label: "Email", value: "" }
      },
      {
        id: "-LyqduQ0G84esGuBLiC4",
        name: "Image",
        component: "Image",
        x1: 100,
        y1: 666,
        x2: 340,
        y2: 722
      }
    ]);
  });

  test.todo("predicate");
});
