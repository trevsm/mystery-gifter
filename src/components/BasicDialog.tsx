import Box from "@mui/material/Box";
import { useState } from "react";
import { Dialog, DialogTitle, Stack } from "@mui/material";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";

export default function BasicDialog({
  forcedOpen,
  title,
}: {
  forcedOpen?: boolean;
  title: string;
}) {
  const [open, setOpen] = useState(forcedOpen || false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <Box px={2} pb={2}>
          <Link href="/login" className="button alt2">
            Login <LoginIcon fontSize="small" />
          </Link>
        </Box>
      </Dialog>
    </Box>
  );
}
