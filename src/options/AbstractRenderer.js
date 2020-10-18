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
        const nextPath = field.value.path[field.value.path.length - 1];
        switch (field.value.type) {
          case "Record":
            const fieldCount = field.value.fields.length;
            RecordValue = () => {
              return (
                <button
                  style={{ display: "inline-block" }}
                  onClick={() =>
                    onNavigate(currPath => [...currPath, nextPath])
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
                    onNavigate(currPath => [...currPath, nextPath])
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

const ListRenderer = ({ options, onChange, onNavigate, depth }) =>
  depth < 2 ? (
    <ol>
      {options.items.map(value => (
        <li key={value.path.join(".")}>
          <AbstractRenderer
            options={value}
            onChange={onChange}
            onNavigate={onNavigate}
            depth={depth + 1}
          />
        </li>
      ))}
    </ol>
  ) : (
    <button
      onClick={() => {
        onNavigate(options.path);
      }}
    >
      {options.items.length} list item{options.items.length === 1 ? "" : "s"} →
    </button>
  );

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
