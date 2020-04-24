Sketchbook.config = {
  initCanvas: doc => {
    const style = doc.createElement("style");
    style.innerHTML = `
      * {
        box-sizing: border-box;
      }
      body {
        font-family: sans-serif;
        font-size: 16px;
        line-height: 1.25;
      }
    `;
    doc.head.appendChild(style);
  },
  components: [
    {
      type: "Heading 1",
      options: [
        {
          key: "text",
          label: "Text",
          input: {
            type: "String"
          }
        }
      ],
      init: () => ({
        options: {
          text: "Lorem ipsum"
        }
      }),
      validate: ({ text }) =>
        text.trim().length === 0
          ? [{ key: "text", message: "Text must be provided" }]
          : null,
      render: ({ element, width, height, options: { text } }) => {
        element.style = "height: 100%; display: flex; align-items: center;";
        element.innerHTML = `
          <h1 style="margin: 0;">${text}</h1>
        `;
      }
    },
    {
      type: "Heading 2",
      options: [
        {
          key: "text",
          label: "Text",
          input: {
            type: "String"
          }
        }
      ],
      init: () => ({
        options: {
          text: "Lorem ipsum"
        }
      }),
      validate: ({ text }) =>
        text.trim().length === 0
          ? [{ key: "text", message: "Text must be provided" }]
          : null,
      render: ({ element, width, height, options: { text } }) => {
        element.style = "height: 100%; display: flex; align-items: center;";
        element.innerHTML = `
          <h2 style="margin: 0;">${text}</h2>
        `;
      }
    },
    {
      type: "Horizontal Rule",
      init: () => ({
        height: 10
      }),
      render: ({ element, height }) => {
        element.innerHTML = `
          <svg width="100%" height="${height ?? 2}" style="display: block;">
            <line
              x1="0"
              x2="100%"
              y1="50%"
              y2="50%"
              stroke="#eee"
              stroke-width="2"
            />
          </svg>
        `;
      }
    },
    {
      type: "Paragraph",
      options: [
        {
          key: "text",
          label: "Text",
          input: {
            type: "PlainText"
          }
        }
      ],
      init: () => ({
        width: 400,
        options: {
          text: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          `.trim()
        }
      }),
      validate: ({ text }) =>
        text.trim().length === 0
          ? [{ key: "text", message: "Text must be provided" }]
          : null,
      render: ({ element, width, height, options: { text } }) => {
        element.innerHTML = `
              <p style="margin: 0;">${text}</p>
            `;
      }
    },
    {
      type: "Image",
      render: ({ element, width, height }) => {
        const w = width ?? 400;
        const h = height ?? 300;
        element.innerHTML = `
          <svg width="${w}" height="${h}" style="display: block;">
            <rect
              width="${w}"
              height="${h}"
              fill="#eee"
              stroke="#ccc"
              stroke-width="8"
            />
            <path
              d="M 0 0 L ${w} ${h} M 0 ${h} L ${w} 0"
              stroke="#ccc"
              stroke-width="4"
            />
          </svg>
        `;
      }
    },
    {
      type: "Button",
      options: [
        {
          key: "label",
          label: "Label",
          input: {
            type: "String"
          }
        }
      ],
      init: () => ({
        options: {
          label: "Button"
        }
      }),
      validate: ({ label }) =>
        label.trim().length === 0
          ? [{ key: "label", message: "Label must be provided" }]
          : null,
      render: ({ element, width, height, options: { label } }) => {
        element.style = "height: 100%;";
        element.innerHTML = `
          <button
            style="
              background: #eee;
              border-radius: 4px;
              border: 2px solid #ccc;
              font-size: 16px;
              height: 100%;
              padding: 8px 8px;
              width: 100%;
            "
          >
            ${label}
          </button>
        `;
      }
    },
    {
      type: "Text Input",
      options: [
        {
          key: "value",
          label: "Value",
          input: {
            type: "String"
          }
        }
      ],
      init: () => ({
        width: 400,
        options: {
          value: ""
        }
      }),
      render: ({ element, width, height, options: { value } }) => {
        element.style = "height: 100%;";
        element.innerHTML = `
          <input
            style="
              border-radius: 4px;
              border: 2px solid #eee;
              font-size: 16px;
              height: 100%;
              padding: 8px 8px;
              width: 100%;
            "
            value="${value}"
          />
        `;
      }
    },
    {
      type: "Label",
      options: [
        {
          key: "text",
          label: "Text",
          input: {
            type: "String"
          }
        }
      ],
      init: () => ({
        options: {
          text: "Lorem ipsum"
        }
      }),
      validate: ({ text }) =>
        text.trim().length === 0
          ? [{ key: "text", message: "Text must be provided" }]
          : null,
      render: ({ element, width, height, options: { text } }) => {
        element.style = "height: 100%; display: flex; align-items: center;";
        element.innerHTML = `
          <label style="font-weight: bold; margin: 0;">${text}</label>
        `;
      }
    }
  ].sort((a, b) => a.type.localeCompare(b.type))
};
