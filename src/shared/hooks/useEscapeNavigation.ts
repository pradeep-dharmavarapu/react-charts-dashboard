import { useEffect } from 'react';
import type { NavigateFunction } from 'react-router-dom';

export const useEscapeNavigation = (navigate: NavigateFunction, to: string) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate(to);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, to]);
};
