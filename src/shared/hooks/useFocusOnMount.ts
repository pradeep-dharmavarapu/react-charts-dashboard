import { useEffect, useRef } from 'react';

export const useFocusOnMount = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  return ref;
};
