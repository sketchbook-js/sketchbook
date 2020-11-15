// @flow

import { useRef, useState } from "react";

type Updater<T> = (current: T) => T;

const useRefState = <T>(
  initial: T
): [{ current: T }, T, (updater: Updater<T>) => void] => {
  const ref = useRef<T>(initial);
  const [state, setState] = useState<T>(ref.current);
  const update = (updater: Updater<T>) => {
    ref.current = updater(ref.current);
    setState(ref.current);
  };
  return [ref, state, update];
};

export default useRefState;
