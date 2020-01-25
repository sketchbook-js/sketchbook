import React, { Fragment } from "react";
import ReactDOM from "react-dom";

const KeyboardShortcutsModal = ({ open, onClose }) => {
  const Backdrop = ({ show, clicked }) =>
    show ? (
      <div
        onClick={clicked}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%"
        }}
      ></div>
    ) : null;

  const shortcutsByType = [
    {
      type: "Global",
      shortcuts: [
        { name: "Undo", keys: ["cmd", "z"] },
        { name: "Redo", keys: ["cmd", "shift", "z"] },
        { name: "Show keyboard shortcuts", keys: ["shift", "/"] }
      ]
    },
    {
      type: "On select",
      shortcuts: [
        { name: "Copy", keys: ["cmd", "c"] },
        { name: "Paste", keys: ["cmd", "v"] },
        { name: "Delete", keys: ["backspace"] },
        { name: "Move selection 1 unit left", keys: ["←"] },
        { name: "Move selection 10 units left", keys: ["shift", "←"] },
        { name: "Move selection 1 unit up", keys: ["↑"] },
        { name: "Move selection 10 units up", keys: ["shift", "↑"] },
        { name: "Move selection 1 unit right", keys: ["→"] },
        { name: "Move selection 10 units right", keys: ["shift", "→"] },
        { name: "Move selection 1 unit down", keys: ["↓"] },
        { name: "Move selection 10 units down", keys: ["shift", "↓"] }
      ]
    }
  ];

  return (
    <>
      {open
        ? ReactDOM.createPortal(
            <>
              <Backdrop show={open} clicked={onClose} />
              <div
                style={{
                  height: "400px",
                  width: "300px",
                  top: "50%",
                  left: "50%",
                  position: "absolute",
                  zIndex: 1000,
                  backgroundColor: "white",
                  marginLeft: "-150px",
                  marginTop: "-200px",
                  overflow: "scroll",
                  borderRadius: "5px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.6rem",
                    backgroundColor: "#e6e6e6"
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>Keyboard Shortcuts</span>
                  <button
                    style={{ fontSize: "1.7rem", cursor: "pointer" }}
                    onClick={onClose}
                  >
                    &times;
                  </button>
                </div>

                <>
                  {shortcutsByType.map(shortcutData => {
                    return (
                      <div
                        key={shortcutData.type}
                        style={{ margin: "0 0.6rem" }}
                      >
                        <h1>{shortcutData.type}</h1>
                        <hr />
                        {shortcutData.shortcuts.map(
                          (shortcut, shortcutIndex) => {
                            const isFirstShortcut = shortcutIndex === 0;
                            return (
                              <div
                                key={shortcut.name}
                                style={{
                                  display: "flex",
                                  marginTop: isFirstShortcut ? "0.6rem" : 0,
                                  justifyContent: "space-between",
                                  marginBottom: "0.5rem"
                                }}
                              >
                                <span>{shortcut.name}</span>
                                <span
                                  style={{
                                    textTransform: "uppercase",
                                    display: "flex"
                                  }}
                                >
                                  {shortcut.keys.map((key, keyIndex) => {
                                    const isLastKey =
                                      shortcut.keys.length - 1 === keyIndex;
                                    return (
                                      <Fragment key={key}>
                                        <div
                                          style={{
                                            padding: "0 0.3rem",
                                            fontSize: "0.9em",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #DFE1E6",
                                            borderRadius: "3px",
                                            color: "#333",
                                            marginRight: !isLastKey
                                              ? "0.3rem"
                                              : 0
                                          }}
                                        >
                                          {key}
                                        </div>
                                        {!isLastKey ? (
                                          <div
                                            style={{ marginRight: "0.3rem" }}
                                          >
                                            +
                                          </div>
                                        ) : null}
                                      </Fragment>
                                    );
                                  })}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  })}
                </>
              </div>
            </>,
            document.body
          )
        : null}
    </>
  );
};

export default KeyboardShortcutsModal;
