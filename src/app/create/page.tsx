"use client";
import LoginIcon from "@mui/icons-material/Login";
import UndoIcon from "@mui/icons-material/Undo";
import HomeIcon from "@mui/icons-material/Home";
import FastForwardIcon from "@mui/icons-material/FastForward";
import DoneIcon from "@mui/icons-material/Done";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import Link from "next/link";
import { useState } from "react";
import useNotificationStore from "@/stores/notificationStore";

export default function Create() {
  const [step, setStep] = useState(0);
  const { addNotification } = useNotificationStore();

  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState<string>();
  const [involved, setInvolved] = useState(false);

  const [shareId, setShareId] = useState("");

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
        isInvolved: involved,
      }),
    });

    if (res.status === 200) {
      const { share_id } = await res.json();
      addNotification({
        id: "create-group-success",
        message: "Group created!",
        type: "success",
      });
      setShareId(share_id);
    } else {
      addNotification({
        id: "create-group-failure",
        message: "Group creation failed.",
        type: "error",
      });
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(shareId)
      .then(() => {
        addNotification({
          id: "copy-group-id-success",
          message: "Group ID copied to clipboard!",
          type: "info",
        });
      })
      .catch((err) => {
        addNotification({
          id: "copy-group-id-failure",
          message: "Failed to copy group ID to clipboard.",
          type: "error",
        });
      });
  };

  if (shareId)
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
        <h2
          style={{
            fontWeight: "bold",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={handleCopyClick}
        >
          {shareId}
        </h2>
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
              marginBottom: 0,
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
          <label
            style={{
              marginBottom: "1rem",
            }}
          >
            Group name:
            <input
              type="text"
              name="name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <div
            style={{
              display: "flex",
              gap: ".5rem",
            }}
          >
            <button
              style={{
                opacity: 0.4,
                pointerEvents: "none",
                filter: "grayscale(1)",
              }}
              className="custom-button alt1"
            >
              Previous <UndoIcon fontSize="small" />
            </button>
            <button type="submit" className="custom-button alt1">
              Next <FastForwardIcon fontSize="small" />
            </button>
          </div>
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
            Continued...
          </p>
        </div>
        <h3
          style={{
            borderBottom: "1px solid #000",
            width: "fit-content",
          }}
        >
          Admin Setup
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateGroup();
          }}
        >
          <label>
            Username:
            <p
              style={{
                fontWeight: "normal",
                fontSize: "15px",
                color: "#727272",
              }}
            >
              (Used for login)
            </p>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </label>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
              marginBottom: involved ? 0 : "1.5rem",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              Involve me in the matchups?
            </span>
            <span
              style={{
                fontSize: "15px",
                fontWeight: "normal",
                color: "#727272",
              }}
            >
              (If checked, you will not be able <br /> to see everyone elses
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
          {involved ? (
            <label
              style={{
                marginBottom: "1.5rem",
              }}
            >
              Display name:
              <input
                type="text"
                name="display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoComplete="off"
              />
            </label>
          ) : null}

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
