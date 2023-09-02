"use client";
import LoginIcon from "@mui/icons-material/Login";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Link from "next/link";
import GroupsIcon from "@mui/icons-material/Groups";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
      }}
    >
      <div>
        <h1>Mystery Gifter</h1>
        <p
          style={{
            fontWeight: "bold",
            marginBottom: "2rem",
          }}
        >
          Easy Peazy Randomized Pairing
        </p>
      </div>
      <Link href="/create" className="button alt1">
        Create a new group <AddBoxIcon fontSize="small" />
      </Link>
      <Link href="/join" className="button">
        Join an existing group <GroupAddIcon fontSize="small" />
      </Link>
      <p
        style={{
          marginTop: "2rem",
        }}
      >
        Already in a group?
      </p>
      <div
        style={{
          display: "flex",
          gap: ".5rem",
        }}
      >
        <Link href="/login" className="button alt2">
          Login <LoginIcon fontSize="small" />
        </Link>
        <Link href="/my-group" className="button alt3">
          My Group <GroupsIcon fontSize="small" />
        </Link>
      </div>
    </div>
  );
}
