import React from "react";

const AbstractRenderer = ({ options, onChange, onNavigate, depth = 0 }) => {
  switch (options.type) {
    case "List":
      return (
        <ListRenderer
          options={options}
          onChange={onChange}
          onNavigate={onNavigate}
          depth={depth}
        />
      );
    case "Record":
      return (
        <RecordRenderer
          options={options}
          onChange={onChange}
          onNavigate={onNavigate}
          depth={depth}
        />
      );
    case "String":
      return (
        <StringRenderer
          options={options}
          onChange={onChange}
          onNavigate={onNavigate}
        />
      );
    // etc
    default:
      throw Error(`Unknown option: ${options.type}`);
  }
};

const RecordRenderer = ({
  options,
  onNavigate,
  onChange
}: {
  options: RecordOption,
  onNavigate: func,
  onChange: func
}) => {
  return (
    <ol>
      {options.fields.map(field => {
        let RecordValue: React.Component = null;
        switch (field.value.type) {
          case "Record":
            const fieldCount = field.value.fields.length;
            RecordValue = () => {
              return (
                <button
                  style={{ display: "inline-block" }}
                  onClick={() =>
                    onNavigate(currPath => [
                      ...currPath,
                      ...field.value.path.slice(-1)
                    ])
                  }
                  disabled={fieldCount === 0}
                >
                  {fieldCount} record{fieldCount === 1 ? "" : "s"}
                </button>
              );
            };
            break;
          case "List":
            const listItemCount = field.value.items.length;
            RecordValue = () => {
              return (
                <button
                  style={{ display: "inline-block" }}
                  onClick={() =>
                    onNavigate(currPath => [
                      ...currPath,
                      ...field.value.path.slice(-1)
                    ])
                  }
                  disabled={listItemCount === 0}
                >
                  {listItemCount} list item{listItemCount === 1 ? "" : "s"}
                </button>
              );
            };
            break;
          default:
            RecordValue = () => {
              return (
                <div style={{ display: "inline-block" }}>
                  {field.value.value}
                </div>
              );
            };
            break;
        }
        return (
          <li key={field.value.path.join(".")}>
            <label>{field.label}</label>
            <RecordValue />
          </li>
        );
      })}
    </ol>
  );
};

const ListRenderer = ({ options, onChange, onNavigate, depth }) => {
  return (
    <ol>
      {options.items.map(item => {
        if (item.type === "List") {
          const listItemCount = item.items.length;
          return (
            <button
              key={item.path.join(".")}
              style={{ display: "inline-block" }}
              onClick={() =>
                onNavigate(currPath => [...currPath, ...item.path.slice(-2)])
              }
              disabled={listItemCount === 0}
            >
              {listItemCount} list item{listItemCount === 1 ? "" : "s"}
            </button>
          );
        }

        if (item.type === "Record") {
          const recordCount = item.fields.length;
          return (
            <button
              key={item.path.join(".")}
              style={{ display: "inline-block" }}
              onClick={() =>
                onNavigate(currPath => [...currPath, ...item.path.slice(-2)])
              }
              disabled={recordCount === 0}
            >
              {recordCount} record{recordCount === 1 ? "" : "s"}
            </button>
          );
        }

        return <li key={item.path.join(".")}>{item.value}</li>;
      })}
    </ol>
  );
};

const StringRenderer = ({ options, onChange, onNavigate }) => (
  <input
    type="text"
    value={options.value}
    onChange={event => {
      onChange(options.path, event.target.value);
    }}
  />
);

export default AbstractRenderer;
