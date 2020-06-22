import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

export function ConfirmationDialog(props: {
  isOpen: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  disableAutoClose?: boolean;
}) {
  return (
    <Dialog open={props.isOpen}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>{props.cancelText || "Cancel"}</Button>
        <Button onClick={props.onConfirm}>{props.confirmText || "OK"}</Button>
      </DialogActions>
    </Dialog>
  );
}
