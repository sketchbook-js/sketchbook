import { set, or, not } from "set-fns";

import { useState, useEffect } from "react";

const useKeys = ({ keydown, keyup }) => {
  const [keys, setKeys] = useState(set());
  useEffect(() => {
    const onKeydown = event => {
      if (keydown) keydown(event);
      setKeys(current => or(current, [event.keyCode]));
    };
    const onKeyup = event => {
      if (keyup) keyup(event);
      setKeys(current => not(current, [event.keyCode]));
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
