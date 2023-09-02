"use client";
import { List, ListItem, Paper, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import BasicDialog from "@/components/BasicDialog";

export default function MyGroup() {
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [members, setMembers] = useState<string[]>([]);

  const getMembers = async () => {
    const res = await fetch("/api/group/viewMembers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    setLoadingMembers(false);

    if (res.members) {
      setMembers(res.members);
    } else if (res.error) {
      setError(res.error);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

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
      <BasicDialog forcedOpen={Boolean(error)} title="Login to view" />
      <Paper
        elevation={3}
        sx={{
          minWidth: "200px",
        }}
      >
        <List
          sx={{
            maxHeight: "300px",
            overflow: "auto",
          }}
        >
          {loadingMembers ? (
            Array(3)
              .fill(null)
              .map((_, index) => (
                <ListItem key={index}>
                  <Skeleton variant="text" width="100%" />
                </ListItem>
              ))
          ) : members.length ? (
            members.map((member, index) => (
              <ListItem key={index}>
                <Typography variant="body1">{member}</Typography>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <Typography variant="body1">No members</Typography>
            </ListItem>
          )}
        </List>
      </Paper>
      {!loadingMembers && (
        <Paper
          elevation={3}
          style={{
            padding: "1rem",
          }}
        >
          <h3
            style={{
              marginBottom: ".5rem",
            }}
          >
            My match:
          </h3>
          <Typography
            variant="body1"
            sx={{
              color: "#999",
            }}
          >
            No match yet
          </Typography>
        </Paper>
      )}
    </div>
  );
}
