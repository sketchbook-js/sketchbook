import React from "react";

const InfoPanel = ({ mouse, viewport, keys }) => (
  <dl className="InfoPanel">
    <style jsx>{`
      .InfoPanel {
        font-family: monospace;
        padding: 0 0.8em;
      }
      * + dt {
        margin-left: 0.8em;
      }
      * + dd {
        margin-left: 0.4em;
      }
      dt,
      dd {
        display: inline;
      }
      dt {
        font-weight: bold;
        text-transform: uppercase;
      }
    `}</style>
    <dt>mouse</dt>
    <dd>{(mouse.x + "," + mouse.y).padEnd(10, " ")}</dd>
    <dt>zoom</dt>
    <dd>{(Math.round(viewport.scale * 100) + "%").padEnd(10, " ")}</dd>
    <dt>viewport</dt>
    <dd>{(viewport.x + "," + viewport.y).padEnd(10, " ")}</dd>
    <dt>mode</dt>
    <dd>{mouse.status.padEnd(10, " ")}</dd>
    <dt>keys</dt>
    <dd>{keys.size === 0 ? "-" : [...keys].join(", ")}</dd>
  </dl>
);

export default InfoPanel;
