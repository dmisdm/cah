import React from "react";
import { useModalState } from "./useModalState";
import { ConfirmationDialog } from "../Components/ConfirmationModal";

export function useConfirmationDialog(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof ConfirmationDialog>,
    "isOpen"
  >
) {
  const modalState = useModalState();
  const onCancel = React.useCallback(() => {
    modalState.close();
    if (props.onCancel) props.onCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onConfirm = React.useCallback(() => {
    modalState.close();
    props.onConfirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const node = (
    <ConfirmationDialog
      {...props}
      isOpen={modalState.isOpen}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
  return {
    ...modalState,
    node,
  };
}
