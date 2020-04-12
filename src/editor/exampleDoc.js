import pushID from "../pushID";

const exampleDoc = {
  layers: [
    {
      id: pushID(),
      type: "Input",
      name: "Input",
      x1: 100,
      y1: 666,
      x2: 500,
      y2: 722,
      options: { value: "" }
    },
    {
      id: pushID(),
      type: "Button",
      name: "Button",
      x1: 417.78125,
      y1: 732,
      x2: 500,
      y2: 768,
      options: { label: "Subscribe" }
    },
    {
      id: pushID(),
      type: "Image",
      name: "Image",
      x1: 100,
      y1: 156,
      x2: 340,
      y2: 336
    },
    {
      id: pushID(),
      type: "Heading 1",
      name: "Heading 1",
      x1: 100,
      y1: 100,
      x2: 392.75,
      y2: 136,
      options: { text: "Example Website" }
    },
    {
      id: pushID(),
      type: "Heading 2",
      name: "Heading 2",
      x1: 350,
      y1: 156,
      x2: 498.34375,
      y2: 180,
      options: { text: "Lorem ipsum" }
    },
    {
      id: pushID(),
      type: "Paragraph",
      name: "Paragraph",
      x1: 350,
      y1: 190,
      x2: 750,
      y2: 310,
      options: {
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      }
    },
    {
      id: pushID(),
      type: "Image",
      name: "Image",
      x1: 510,
      y1: 356,
      x2: 750,
      y2: 536
    },
    {
      id: pushID(),
      type: "Heading 2",
      name: "Heading 2",
      x1: 100,
      y1: 356,
      x2: 248.34375,
      y2: 380,
      options: { text: "Lorem ipsum" }
    },
    {
      id: pushID(),
      type: "Paragraph",
      name: "Paragraph",
      x1: 100,
      y1: 390,
      x2: 500,
      y2: 510,
      options: {
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      }
    },
    {
      id: pushID(),
      type: "Heading 2",
      name: "Heading 2",
      x1: 100,
      y1: 632,
      x2: 248.34375,
      y2: 656,
      options: { text: "Lorem ipsum" }
    },
    {
      id: pushID(),
      type: "Heading 1",
      name: "Heading 1",
      x1: 100,
      y1: 576,
      x2: 340.640625,
      y2: 612,
      options: { text: "Example Form" }
    }
  ]
};

export default exampleDoc;
