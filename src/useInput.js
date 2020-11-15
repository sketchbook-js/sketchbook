// @flow

import { set, not as subtract, or as union } from "set-fns";
import { useEffect, useRef } from "react";

import useRefState from "./useRefState";

declare class Window extends EventTarget {
  [string]: any;
}
declare var window: Window;

type Config = {
  keys: Set<string>
};

type State = {
  keysPressed: Set<string>,
  mouseX: ?number,
  mouseY: ?number,
  mouseIsPressed: boolean,
  mouseIsDragging: boolean,
  mouseDragStartX: ?number,
  mouseDragStartY: ?number
};

type Props = {
  config: Config,
  keyDown: (KeyboardEvent, State) => {},
  keyUp: (KeyboardEvent, State) => {},
  mouseDown: (MouseEvent, State) => {},
  mouseUp: (MouseEvent, State) => {},
  mouseMove: (MouseEvent, State) => {},
  click: (MouseEvent, State) => {}
};

const DEFAULT_CONFIG = {
  keys: set([
    "ArrowLeft",
    "ArrowUp",
    "ArrowRight",
    "ArrowDown",
    "Backspace",
    "Space",
    "ShiftLeft",
    "ShiftRight"
  ])
};

// These are keys that don't repeatedly fire keydown events when held down.
const MODIFIER_KEYS = set(["ShiftLeft", "ShiftRight"]);

// Amount of time to wait for a repeated keydown events before
// assuming the key is no longer down.
const REPEAT_TIMEOUT = 2000;

const useInput = ({
  config = DEFAULT_CONFIG,
  keyDown,
  keyUp,
  mouseDown,
  mouseUp,
  mouseMove,
  click
}: Props) => {
  const [ref, state, update] = useRefState<State>({
    keysPressed: set(),
    mouseX: undefined,
    mouseY: undefined,
    mouseIsPressed: false,
    mouseIsDragging: false,
    mouseDragStartX: undefined,
    mouseDragStartY: undefined
  });
  const keyTimeouts = useRef<{ [string]: TimeoutID, ... }>({});

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        !config.keys.has(event.code) ||
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      )
        return;
      if (keyDown) keyDown(event, ref.current);
      if (!ref.current.keysPressed.has(event.code)) {
        update(current => ({
          ...current,
          keysPressed: union(current.keysPressed, [event.code])
        }));
      }
      clearTimeout(keyTimeouts.current[event.code]);
      if (!MODIFIER_KEYS.has(event.code)) {
        keyTimeouts.current[event.code] = setTimeout(() => {
          if (ref.current.keysPressed.has(event.code)) {
            update(current => ({
              ...current,
              keysPressed: subtract(current.keysPressed, [event.code])
            }));
          }
        }, REPEAT_TIMEOUT);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (
        !config.keys.has(event.code) ||
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      )
        return;
      if (keyUp) keyUp(event, ref.current);
      if (ref.current.keysPressed.has(event.code)) {
        update(current => ({
          ...current,
          keysPressed: subtract(current.keysPressed, [event.code])
        }));
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (mouseDown) mouseDown(event, ref.current);
      update(current => ({
        ...current,
        mouseIsPressed: true,
        mouseDragStartX: event.clientX,
        mouseDragStartY: event.clientY
      }));
    };

    const onMouseUp = (event: MouseEvent) => {
      if (mouseUp) mouseUp(event, ref.current);
      update(current => ({
        ...current,
        mouseIsPressed: false,
        mouseIsDragging: false,
        mouseDragStartX: undefined,
        mouseDragStartY: undefined
      }));
    };

    const onMouseMove = (event: MouseEvent) => {
      if (mouseMove) mouseMove(event, ref.current);
      if (
        ref.current.mouseIsPressed &&
        !ref.current.mouseIsDragging &&
        typeof ref.current.mouseDragStartX === "number" &&
        typeof ref.current.mouseDragStartY === "number"
      ) {
        const dx = event.clientX - ref.current.mouseDragStartX;
        const dy = event.clientY - ref.current.mouseDragStartY;
        const distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
        if (distance > 1) {
          update(current => ({
            ...current,
            mouseIsDragging: true
          }));
        }
      }
      update(current => ({
        ...current,
        mouseX: event.clientX,
        mouseY: event.clientY
      }));
    };

    const onClick = (event: MouseEvent) => {
      if (click) click(event, ref.current);
    };

    const onBlur = () => {
      update(current => ({
        ...current,
        keysPressed: set(),
        mouseX: undefined,
        mouseY: undefined,
        mouseIsPressed: false,
        mouseIsDragging: false,
        mouseDragStartX: undefined,
        mouseDragStartY: undefined
      }));
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("click", onClick);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onClick);
      window.removeEventListener("blur", onBlur);
    };
  }, [
    config,
    keyDown,
    keyUp,
    mouseDown,
    mouseUp,
    mouseMove,
    click,
    ref,
    update,
    keyTimeouts
  ]);

  return [ref, state];
};

export default useInput;
