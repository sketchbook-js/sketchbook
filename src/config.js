import React from "react";

const config = {
  "Heading 1": {
    render: ({ width, height, options: { text } }) => (
      <h1
        style={{
          width,
          height,
          fontSize: 36,
          fontWeight: "bold",
          lineHeight: 1
        }}
      >
        {text}
      </h1>
    ),
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
    ]
  },
  "Heading 2": {
    render: ({ width, height, options: { text } }) => (
      <h2 style={{ width, height, fontSize: 24, fontWeight: "bold" }}>
        {text}
      </h2>
    ),
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
    ]
  },
  Paragraph: {
    render: ({ width, height, options: { text } }) => (
      <p style={{ width, height }}>{text}</p>
    ),
    init: () => ({
      width: 400,
      options: {
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      }
    }),
    options: [
      {
        key: "text",
        input: "short-string",
        label: "Text"
      }
    ]
  },
  Image: {
    render: ({ width, height }) => (
      <svg
        width={width ?? 400}
        height={height ?? 300}
        viewBox={`0 0 ${width ?? 400} ${height ?? 300}`}
        style={{ display: "block" }}
      >
        <rect
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          fill="#eee"
          stroke="#ccc"
          strokeWidth="8"
        />
        <line
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          stroke="#ccc"
          strokeWidth="4"
        />
        <line
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          stroke="#ccc"
          strokeWidth="4"
        />
      </svg>
    )
  },
  Button: {
    render: ({ width, height, options: { label } }) => (
      <button
        style={{
          background: "#eee",
          borderRadius: 6,
          fontWeight: "bold",
          padding: "6px 12px",
          width,
          height,
          textAlign: "center"
        }}
      >
        {label}
      </button>
    ),
    init: () => ({
      options: {
        label: "Button"
      }
    }),
    options: [{ key: "label", label: "Label", input: "short-string" }]
  },
  Input: {
    render: ({ width, height, options: { label, value } }) => (
      <div>
        <label
          style={{
            fontWeight: "bold"
          }}
        >
          {label}
        </label>
        <input
          style={{
            border: "1px solid #ccc",
            padding: "3px",
            width
          }}
          value={value}
        />
      </div>
    ),
    init: () => ({
      width: 400,
      options: {
        label: "Label"
      }
    }),
    options: [
      { key: "label", label: "Label", input: "short-string" },
      { key: "value", label: "Value", input: "short-string" }
    ]
  }
};

export default config;
