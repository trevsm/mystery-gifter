"use client";
import {
  Button,
  List,
  ListItem,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import BasicDialog from "@/components/BasicDialog";

export default function MyGroup() {
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [me, setMe] = useState<{
    group_name: string;
    username: string;
    is_admin: boolean;
  }>();
  const [members, setMembers] = useState<
    {
      displayName: string;
      is_admin: boolean;
      is_involved: boolean;
    }[]
  >([]);

  const sortedMembers = members.sort((a, b) => {
    if (a.is_admin && !b.is_admin) return -1;
    if (!a.is_admin && b.is_admin) return 1;
    return 0;
  });

  const getMembers = async () => {
    const res = await fetch("/api/group/getInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    setLoadingMembers(false);

    if (res.members && res.me) {
      setMembers(res.members);
      setMe(res.me);
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
      <div>
        <h1
          style={{
            marginBottom: ".5rem",
          }}
        >
          My Group
        </h1>
        <Typography variant="body1" sx={{ color: "#999" }}>
          {me?.group_name}
        </Typography>
      </div>
      <BasicDialog forcedOpen={!!error} title="Login to view" />
      <Paper
        elevation={3}
        sx={{
          minWidth: "200px",
          padding: "1rem",
        }}
      >
        <h3 style={{ marginBottom: ".5rem" }}>Members:</h3>
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
            sortedMembers.map(({ displayName, is_admin }, index) => (
              <ListItem
                key={index}
                sx={{
                  px: 0,
                }}
              >
                <Typography variant="body1">{displayName}</Typography>
                {is_admin && (
                  <Typography variant="body1" sx={{ color: "#999", ml: 1 }}>
                    (admin)
                  </Typography>
                )}
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
            The admin of your group <br />
            will assign you soon.
          </Typography>
        </Paper>
      )}

      {me?.is_admin && (
        <Paper elevation={3} style={{ padding: "1rem" }}>
          <h3 style={{ marginBottom: ".5rem" }}>Admin Tools:</h3>
          <div
            style={{
              display: "flex",
            }}
          >
            <button className="custom-button alt4">Pair everyone up!</button>
          </div>
        </Paper>
      )}
    </div>
  );
}
