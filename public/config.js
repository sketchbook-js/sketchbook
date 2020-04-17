Sketchbook.config = {
  components: [
    { type: "Rectangle" },
    {
      type: "Heading 1",
      render: ({ element, width, height, options: { text } }) => {
        element.style = "height: 100%; display: flex; align-items: center;";
        element.innerHTML = `<h1 style="margin: 0;">${text}</h1>`;
      },
      init: () => ({
        options: {
          text: "Lorem ipsum"
        }
      }),
      options: [
        {
          key: "text",
          input: "short-string",
          label: "Text"
        }
      ],
      validate: options => {
        return options.text.trim().length === 0
          ? [{ key: "text", message: "Text must be provided" }]
          : null;
      }
    },
    {
      type: "Heading 2",
      render: ({ element, width, height, options: { text } }) => {
        element.style = "height: 100%; display: flex; align-items: center;";
        element.innerHTML = `<h2 style="margin: 0;">${text}</h2>`;
      },
      init: () => ({
        options: {
          text: "Lorem ipsum"
        }
      }),
      options: [
        {
          key: "text",
          input: "short-string",
          label: "Text"
        }
      ],
      validate: options => {
        return options.text.trim().length === 0
          ? [{ key: "text", message: "Text must be provided" }]
          : null;
      }
    },
    {
      type: "Paragraph",
      render: ({ element, width, height, options: { text } }) => {
        element.innerHTML = `<p style="margin: 0;">${text}</p>`;
      },
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
      options: [
        {
          key: "text",
          input: "long-string",
          label: "Text"
        }
      ],
      validate: options => {
        return options.text.trim().length === 0
          ? [{ key: "text", message: "Text must be provided" }]
          : null;
      }
    },
    {
      type: "Image",
      render: ({ element, width, height }) => {
        const w = width === undefined || width === null ? 400 : width;
        const h = height === undefined || height === null ? 300 : height;
        element.innerHTML = `
          <svg width="${w}" height="${h}">
            <rect width="${w}" height="${h}" fill="#eee" stroke="#ccc" stroke-width="8"/>
            <path d="M 0 0 L ${w} ${h} M 0 ${h} L ${w} 0" stroke="#ccc" stroke-width="4"/>
          </svg>
        `.trim();
      }
    },
    {
      type: "Button",
      render: ({ element, width, height, options: { label } }) => {
        element.style = "height: 100%;";
        element.innerHTML = `<button style="width: 100%; height: 100%;">${label}</button>`;
      },
      init: () => ({
        options: {
          label: "Button"
        }
      }),
      options: [{ key: "label", label: "Label", input: "short-string" }],
      validate: options => {
        return options.label.trim().length === 0
          ? [{ key: "label", message: "Label must be provided" }]
          : null;
      }
    },
    {
      type: "Input",
      render: ({ element, width, height, options: { value } }) => {
        element.style = "height: 100%;";
        element.innerHTML = `<input style="box-sizing: border-box; width: 100%; height: 100%;" value="${value}"/>`;
      },
      init: () => ({
        width: 400,
        options: {
          value: ""
        }
      }),
      options: [{ key: "value", label: "Value", input: "short-string" }]
    }
  ]
};
