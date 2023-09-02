"use client";

import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import useNotificationStore from "@/stores/notificationStore";
import { useRouter } from "next/navigation";
import useGroupInputLookup, {
  actionButtonProps,
} from "@/components/GroupInputLookup";
import GroupInputLookup from "@/components/GroupInputLookup";

export default function Join() {
  const { addNotification } = useNotificationStore();

  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const router = useRouter();

  const foundGroupState = useState<string>("");
  const [foundGroup] = foundGroupState;

  const shareIdState = useState<string>("");
  const [shareId] = shareIdState;

  const loadingState = useState<boolean>(false);
  const [loading] = loadingState;

  const errorState = useState<string>();
  const [error] = errorState;

  const handleJoinGroup = async () => {
    const res = await fetch("/api/group/joinGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        share_id: shareId,
        username,
        display_name: displayName,
      }),
    }).then((res) => res.json());

    if (res.message) {
      addNotification({
        id: "join-group-success",
        message: "Joined group!",
        type: "success",
      });
      router.push(`/my-group`);
    } else if (res.error) {
      addNotification({
        id: "join-group-failure",
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
          Join
        </h1>
        {!foundGroup && (
          <p style={{ fontWeight: "bold", marginBottom: ".5rem" }}>
            Enter your group ID
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJoinGroup();
          }}
        >
          <GroupInputLookup
            shareIdState={shareIdState}
            foundGroupState={foundGroupState}
            loadingState={loadingState}
            errorState={errorState}
          />
          {foundGroup && (
            <>
              <h3>New member</h3>
              <TextField
                label="Username"
                type="text"
                autoComplete="off"
                size="small"
                helperText="Used for logging in"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Display name"
                type="text"
                autoComplete="off"
                helperText="This will be visible to other members"
                size="small"
                sx={{
                  mb: 2,
                }}
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </>
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
