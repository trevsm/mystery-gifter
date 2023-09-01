// NotificationSnackbar.tsx
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type NotificationProps = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  open: boolean;
  onClose: (id: string) => void;
};

const NotificationSnackbar: React.FC<NotificationProps> = ({
  id,
  message,
  type,
  open,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => onClose(id)}
      message={message}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={() => onClose(id)} severity={type} elevation={2}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
