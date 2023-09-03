"use client";
import {
  CircularProgress,
  List,
  ListItem,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import BasicDialog from "@/components/BasicDialog";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

export default function MyGroup() {
  const [nextLoading, setNextLoading] = useState<boolean>(false);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  const [me, setMe] = useState<{
    group_name: string;
    username: string;
    is_admin: boolean;
    is_involved: boolean;
    assigned_to: string;
  }>();

  const [members, setMembers] = useState<
    {
      displayName: string;
      is_admin: boolean;
      is_involved: boolean;
      assigned_to?: string;
    }[]
  >([]);

  const sortedMembers = members.sort((a, b) => {
    if (a.is_admin && !b.is_admin) return -1;
    if (!a.is_admin && b.is_admin) return 1;
    return 0;
  });

  const getInfo = async () => {
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
    setNextLoading(false);

    if (res.members && res.me) {
      setMembers(res.members);
      setMe(res.me);
    } else if (res.error) {
      setError(res.error);
    }
  };

  const makeAssignments = async () => {
    setNextLoading(true);
    const res = await fetch("/api/group/assignMembers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    if (res.error) {
      setError(res.error);
    } else {
      getInfo();
    }
  };

  useEffect(() => {
    getInfo();
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
          {loadingMembers || nextLoading ? (
            Array(members?.length || 3)
              .fill(null)
              .map((_, index) => (
                <ListItem
                  key={index}
                  sx={{
                    px: 0,
                  }}
                >
                  <Skeleton variant="text" width="100%" height={24} />
                </ListItem>
              ))
          ) : members.length ? (
            sortedMembers.map(
              ({ displayName, is_admin, assigned_to }, index) => (
                <ListItem
                  key={index}
                  sx={{
                    px: 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                    }}
                  >
                    {displayName}
                    {is_admin && (
                      <span
                        style={{
                          color: "#999",
                          marginLeft: ".5rem",
                        }}
                      >
                        (admin)
                      </span>
                    )}
                    {me?.is_admin && !me?.is_involved && assigned_to && (
                      <Tooltip
                        title={`Assigned to ${assigned_to}`}
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        <AssignmentIndIcon fontSize="small" />
                      </Tooltip>
                    )}
                  </Typography>
                </ListItem>
              )
            )
          ) : (
            <ListItem>
              <Typography variant="body1">No members</Typography>
            </ListItem>
          )}
        </List>
      </Paper>
      {!loadingMembers && me?.is_involved && (
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
            My assignment:
          </h3>
          <Typography
            variant="body1"
            sx={{
              color: "#999",
            }}
          >
            {nextLoading ? (
              <CircularProgress size={15} />
            ) : me.assigned_to ? (
              me.assigned_to
            ) : me.is_admin ? (
              <>You have not made assignments yet.</>
            ) : (
              <>
                The admin of your group <br />
                will assign you soon.
              </>
            )}
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
            <button
              className="custom-button alt4"
              onClick={makeAssignments}
              disabled={nextLoading}
            >
              {me?.assigned_to ? "Reassign Matches" : "Assign Matches"}
            </button>
          </div>
        </Paper>
      )}
    </div>
  );
}
