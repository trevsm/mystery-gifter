"use client";
import LoginIcon from "@mui/icons-material/Login";
import UndoIcon from "@mui/icons-material/Undo";
import HomeIcon from "@mui/icons-material/Home";
import FastForwardIcon from "@mui/icons-material/FastForward";
import DoneIcon from "@mui/icons-material/Done";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Link from "next/link";
import useNotificationStore from "@/stores/notificationStore";

import { TextField } from "@mui/material";
import { useState } from "react";
import CopyInput from "@/components/CopyInput";

export default function Create() {
  const [step, setStep] = useState(0);
  const { addNotification } = useNotificationStore();

  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState<string>();
  const [involved, setInvolved] = useState(false);

  const [groupId, setgroupId] = useState("");

  const handleCreateGroup = async () => {
    const res = await fetch("/api/group/newGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_name: groupName,
        username,
        display_name: displayName,
        is_involved: involved,
      }),
    }).then((res) => res.json());

    if (res.error) {
      addNotification({
        id: "create-group-failure",
        message: res.error,
        type: "error",
      });
    } else if (res.group_id) {
      addNotification({
        id: "create-group-success",
        message: "Group created!",
        type: "success",
      });
      setgroupId(res.group_id);
    }
  };

  if (groupId)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h1>Group created!</h1>
          <h3>Share this Group ID for others to join.</h3>
        </div>
        <CopyInput text={groupId} />
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Link href="/" className="button alt1">
            Back to home <HomeIcon fontSize="small" />
          </Link>
          <Link href="login" className="button alt2">
            Login <LoginIcon fontSize="small" />
          </Link>
        </div>
      </div>
    );

  if (step === 0)
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
          <h1>New group</h1>
          <p
            style={{
              fontWeight: "bold",
            }}
          >
            Lets get started!
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(1);
          }}
        >
          <TextField
            label="Group name"
            type="text"
            name="name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            autoComplete="off"
            size="small"
            helperText="Name your group something fun or meaningful"
            sx={{
              mb: 2,
            }}
          />

          <button
            type="submit"
            className="custom-button alt1"
            disabled={!groupName}
          >
            Next <FastForwardIcon fontSize="small" />
          </button>
        </form>
      </div>
    );

  if (step === 1)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Link
          href="/"
          className="button alt3"
          style={{
            marginBottom: "1rem",
          }}
        >
          Go home <HomeIcon fontSize="small" />
        </Link>

        <div>
          <h1>New group</h1>
          <p
            style={{
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Admin details
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateGroup();
          }}
        >
          <TextField
            label="Username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
            size="small"
            helperText="Used for logging in"
          />

          <TextField
            label="Display name"
            type="text"
            name="display_name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            helperText="This will be visible to other members"
            required
            autoComplete="off"
            size="small"
            sx={{
              mb: 2,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              Do you want to be paired up?
            </span>
            <span
              style={{
                fontSize: "15px",
                fontWeight: "normal",
                color: "#727272",
                maxWidth: "250px",
              }}
            >
              (If checked, you will not be able to see anyone else&apos;s
              matches)
            </span>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                backgroundColor: "#fff",
                width: "fit-content",
                color: involved ? "cornflowerblue" : "#ccc",
                clipPath: "inset(3px)",
              }}
            >
              {involved ? (
                <CheckBoxIcon onClick={() => setInvolved(false)} />
              ) : (
                <CheckBoxOutlineBlankIcon onClick={() => setInvolved(true)} />
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: ".5rem",
            }}
          >
            <button className="custom-button alt1" onClick={() => setStep(0)}>
              Previous <UndoIcon fontSize="small" />
            </button>
            <button type="submit" className="custom-button alt2">
              Create Group! <DoneIcon fontSize="small" />
            </button>
          </div>
        </form>
      </div>
    );
}
