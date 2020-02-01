import { set, or, not } from "set-fns";

import { useState, useEffect } from "react";

const useKeys = ({ keydown, keyup }) => {
  const [keys, setKeys] = useState(set());
  const [metaKeyPressed, setMetaKeyPressed] = useState(false);
  useEffect(() => {
    const onKeydown = event => {
      if (
        keydown &&
        !(
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        )
      )
        keydown(event);
      setKeys(current => or(current, [event.code]));
      setMetaKeyPressed(event.metaKey);
    };
    const onKeyup = event => {
      if (
        keyup &&
        !(
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        )
      )
        keyup(event);
      // Metakey (command key on Mac keyboard) needs to be handled specially due to how MacOS handles keyup with the metakey. More details here: https://stackoverflow.com/questions/25438608/javascript-keyup-isnt-called-when-command-and-another-is-pressed
      if (metaKeyPressed && !event.metaKey) {
        setKeys(set());
      } else {
        setKeys(current => not(current, [event.code]));
      }
    };
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    };
  }, [keydown, keyup, metaKeyPressed, setKeys]);
  return keys;
};

export default useKeys;
