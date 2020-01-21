import { set, or, not } from "set-fns";

import { useState, useEffect } from "react";

const useKeys = ({ keydown, keyup }) => {
  const [keys, setKeys] = useState(set());
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
      setKeys(current => not(current, [event.code]));
    };
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    };
  }, [keydown, keyup, setKeys]);
  return keys;
};

export default useKeys;
