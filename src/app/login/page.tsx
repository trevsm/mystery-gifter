"use client";

import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import useNotificationStore from "@/stores/notificationStore";
import GroupInputLookup, {
  actionButtonProps,
} from "@/components/GroupInputLookup";

export default function Login() {
  const { addNotification } = useNotificationStore();

  const [username, setUsername] = useState<string>("");

  const foundGroupState = useState<string>("");
  const [foundGroup] = foundGroupState;

  const shareIdState = useState<string>("");
  const [shareId] = shareIdState;

  const loadingState = useState<boolean>(false);
  const [loading] = loadingState;

  const errorState = useState<string>();
  const [error] = errorState;

  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/group/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        share_id: shareId,
        username,
      }),
    }).then((res) => res.json());

    if (res.message) {
      addNotification({
        id: "login-success",
        message: "Login Successful",
        type: "success",
      });
      router.push(`/my-group`);
    } else if (res.error) {
      addNotification({
        id: "login-failure",
        message: res.error,
        type: "error",
      });
    }
  };

  const { disabled, label } = actionButtonProps({
    defaultLabel: "Login",
    shareId,
    foundGroup,
    loading,
    error,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <Link href="/" className="button alt3">
        Go home <HomeIcon fontSize="small" />
      </Link>
      <div>
        <h1
          style={{
            marginBottom: "1rem",
          }}
        >
          Login
        </h1>
        {!foundGroup && (
          <p style={{ fontWeight: "bold", marginBottom: ".5rem" }}>
            Enter your group ID
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <GroupInputLookup
            shareIdState={shareIdState}
            foundGroupState={foundGroupState}
            loadingState={loadingState}
            errorState={errorState}
          />
          {foundGroup && (
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              required
              sx={{
                mb: 2,
              }}
            />
          )}
          <Button
            type="submit"
            className="custom-button alt2"
            disabled={disabled}
          >
            {label}
          </Button>
        </form>
      </div>
    </div>
  );
}
