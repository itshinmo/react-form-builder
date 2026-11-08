import * as React from "react";

/**
 * Small shared state helper for the builder's modal controllers.
 */
const useModalState = <T>() => {
  const [item, setItem] = React.useState<T | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback((nextItem: T) => {
    setItem(nextItem);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const clear = React.useCallback(() => {
    setItem(null);
  }, []);

  return { item, isOpen, open, close, clear };
};

export default useModalState;
