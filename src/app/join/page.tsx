"use client";

import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import { useDebounce } from "usehooks-ts";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import useNotificationStore from "@/stores/notificationStore";
import { useRouter } from "next/navigation";

export default function Join() {
  const [shareId, setShareId] = useState<string>("");
  const debouncedShareId = useDebounce<string>(shareId, 500);
  const [loading, setLoading] = useState<boolean>(false);
  const { addNotification } = useNotificationStore();

  const [foundGroup, setFoundGroup] = useState<string>();
  const [error, setError] = useState<string>();

  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const router = useRouter();

  const handleJoinGroup = async () => {
    const res = await fetch("/api/group/joinGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        share_id: debouncedShareId,
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

  useEffect(() => {
    const getGroupNameFromId = async (id: string) => {
      setLoading(true);

      const response = await fetch(`/api/group/getGroupName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ share_id: id }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.groupName) setFoundGroup(data.groupName);
      else {
        setFoundGroup("");
        setError(data.error);
      }
    };

    if (debouncedShareId && !foundGroup) {
      getGroupNameFromId(debouncedShareId);
    }
  }, [debouncedShareId, foundGroup]);

  let joinLabel = "Enter a group ID";

  if (loading || (shareId && !foundGroup && !error)) joinLabel = "Loading...";
  if (foundGroup) joinLabel = "Join Group";
  if (!loading && !foundGroup && error) joinLabel = "Group not found";

  const isButtonDisabled = joinLabel !== "Join Group";

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
          <TextField
            label={foundGroup ? shareId : "Group ID"}
            type="text"
            value={foundGroup || shareId}
            onChange={(e) => {
              setError("");
              setFoundGroup("");
              setShareId(e.target.value);
            }}
            sx={{
              mb: 3,
              mt: 1,
            }}
            size="small"
            disabled={!!foundGroup}
            InputProps={{
              endAdornment: foundGroup ? (
                <CheckIcon sx={{ color: "green" }} />
              ) : (
                ""
              ),
            }}
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
            className="custom-button"
            disabled={isButtonDisabled}
          >
            {joinLabel}
          </Button>
        </form>
      </div>
    </div>
  );
}
