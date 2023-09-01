"use client";
import LoginIcon from "@mui/icons-material/Login";
import UndoIcon from "@mui/icons-material/Undo";
import HomeIcon from "@mui/icons-material/Home";
import FastForwardIcon from "@mui/icons-material/FastForward";
import DoneIcon from "@mui/icons-material/Done";

import Link from "next/link";
import { useState } from "react";

export default function Create() {
  const [step, setStep] = useState(0);

  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

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
      }),
    });

    if (res.status === 200) {
      const { share_id } = await res.json();
      setShareId(share_id);
    } else {
      console.log("Error creating group");
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(shareId)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.log("Unable to copy text", err);
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
        <Link href="/" className="button alt3">
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
            htmlFor="name"
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
              className="alt1"
            >
              Previous <UndoIcon fontSize="small" />
            </button>
            <button type="submit" className="alt1">
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
        <Link href="/" className="button alt3">
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
            Continued...
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateGroup();
          }}
        >
          <p
            style={{
              marginBottom: "1rem",
            }}
          >
            (You will be the first member)
          </p>

          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label
            htmlFor="display_name"
            style={{
              marginBottom: "1rem",
            }}
          >
            Display name:
            <input
              type="text"
              name="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: ".5rem",
            }}
          >
            <button className="alt1" onClick={() => setStep(0)}>
              Previous <UndoIcon fontSize="small" />
            </button>
            <button type="submit" className="alt2">
              Create Group! <DoneIcon fontSize="small" />
            </button>
          </div>
        </form>
      </div>
    );
}
