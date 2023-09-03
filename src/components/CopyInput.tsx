import useNotificationStore from "@/stores/notificationStore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { TextField, TextFieldProps } from "@mui/material";

export default function CopyInput({
  text,
  size,
  label,
}: {
  text: string;
  size?: TextFieldProps["size"];
  label?: TextFieldProps["label"];
}) {
  const { addNotification } = useNotificationStore();

  const successAlert = () => {
    addNotification({
      id: "copy-group-id-success",
      message: "Group ID copied to clipboard!",
      type: "info",
    });
  };

  const failedAlert = () =>
    addNotification({
      id: "copy-group-id-failure",
      message: "Failed to copy group ID to clipboard.",
      type: "error",
    });

  const fallbackAlert = () =>
    addNotification({
      id: "copy-group-id-failure",
      message: "Failed to copy group ID to clipboard.",
      type: "error",
    });

  const handleCopyClick = () => {
    // Modern way using Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(successAlert, (err) => {
        console.error("Could not copy text: ", err);
        fallbackAlert();
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Avoid scrolling to the bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          successAlert();
        } else {
          failedAlert();
        }
      } catch (err) {
        console.error("Unable to copy", err);
      }

      document.body.removeChild(textArea);
    }
  };

  return (
    <div
      style={{
        margin: "0 auto",
        cursor: "pointer",
      }}
      onClick={handleCopyClick}
    >
      <TextField
        value={text}
        helperText="Click to copy"
        sx={{
          width: "130px",
          margin: "0 auto",
          pointerEvents: "none",
        }}
        InputProps={{
          endAdornment: <ContentCopyIcon />,
        }}
        size={size}
        label={label}
      />
    </div>
  );
}
