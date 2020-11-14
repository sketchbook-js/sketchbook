// @flow
import pushID from "../pushID";
import type { SketchbookDocument } from "../types/types";

const exampleDoc: SketchbookDocument = {
  type: "SketchbookDocument",
  layers: [
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Example",
      name: "Example",
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      options: {
        title: "Example title",
        items: ["Example text A", "Example text B", "Example text C"],
        // items: [["a", "b"], ["c"]],
        buckets: {
          pinkBucket: "Records -> string"
        },
        // TODO: below
        // myLinks: {
        //   // website: "webby",
        //   list: ["item1", "item2"]
        // },
        meat: [
          {
            poultry: "Chicken!"
          }
        ],
        // TODO: below
        nestedList1: [
          [["c"], ["d", "e"]],
          [["a"], ["b"]]
        ],
        // listOfListOfString: [{ list: ["l1"] }], // Get the index
        // listOfRecordsOfString: [{ record1: "record1text" }], // Get the index
        // recordOfListOfString: {
        //   record: ["string1", "string2", "string3"]
        // }, // Get the key
        // recordOfRecordOfString: {
        //   record1: {
        //     record2: "string"
        //   }
        // }
        links: {
          website: {
            url: "https://example.com",
            text: "example"
          }
        }
        // labels: ["new", "popular"],
        // highlight: true
      }
    },
    // {
    //   id: pushID(),
    //   type: "SketchbookComponent",
    //   component: "Heading 1",
    //   name: "Heading 1",
    //   x1: 100,
    //   y1: 100,
    //   x2: 750,
    //   y2: 140,
    //   options: { text: "Example Website" }
    // },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Heading 2",
      name: "Heading 2",
      x1: 350,
      y1: 160,
      x2: 750,
      y2: 200,
      options: { text: "Lorem ipsum" }
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Paragraph",
      name: "Paragraph",
      x1: 350,
      y1: 210,
      x2: 750,
      y2: 340,
      options: {
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Image",
      name: "Image",
      x1: 100,
      y1: 160,
      x2: 340,
      y2: 340
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Heading 2",
      name: "Heading 2",
      x1: 100,
      y1: 360,
      x2: 500,
      y2: 400,
      options: { text: "Lorem ipsum" }
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Paragraph",
      name: "Paragraph",
      x1: 100,
      y1: 410,
      x2: 500,
      y2: 540,
      options: {
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Image",
      name: "Image",
      x1: 510,
      y1: 360,
      x2: 750,
      y2: 540
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Horizontal Rule",
      name: "Horizontal Rule",
      x1: 100,
      y1: 560,
      x2: 100 + 650,
      y2: 560 + 10
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Heading 1",
      name: "Heading 1",
      x1: 100,
      y1: 590,
      x2: 100 + 650,
      y2: 590 + 40,
      options: { text: "Example Form" }
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Label",
      name: "Label",
      x1: 100,
      y1: 650,
      x2: 100 + 650,
      y2: 650 + 20,
      options: { text: "Email" }
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Text Input",
      name: "Text Input",
      x1: 100,
      y1: 680,
      x2: 100 + 300,
      y2: 680 + 38,
      options: { value: "" }
    },
    {
      id: pushID(),
      type: "SketchbookComponent",
      component: "Button",
      name: "Button",
      x1: 410,
      y1: 680,
      x2: 410 + 93,
      y2: 680 + 38,
      options: { label: "Subscribe" }
    }
  ]
};

export default exampleDoc;
