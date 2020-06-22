import React from "react";

export const useModalState = (initiallyOpened?: boolean) => {
  const [isOpen, setIsOpen] = React.useState(!!initiallyOpened);
  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);
  return {
    open,
    close,
    isOpen,
  };
};
