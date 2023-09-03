"use client";
import {
  CircularProgress,
  IconButton,
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
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import useNotificationStore from "@/stores/notificationStore";
import CopyInput from "@/components/CopyInput";

export default function MyGroup() {
  const [nextLoading, setNextLoading] = useState<boolean>(false);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [infoError, setInfoError] = useState<string>();
  const { addNotification } = useNotificationStore();

  const [me, setMe] = useState<{
    group_name: string;
    username: string;
    is_admin: boolean;
    is_involved: boolean;
    assigned_to: string;
    group_id: string;
  }>();

  const [members, setMembers] = useState<
    {
      displayName: string;
      is_admin: boolean;
      is_involved: boolean;
      assigned_to?: string;
      username?: string;
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
      setInfoError(res.error);
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

    setNextLoading(false);

    if (res.error) {
      addNotification({
        id: "assign-error",
        message: res.error,
        type: "error",
      });
    } else {
      getInfo();
    }
  };

  const deleteMember = async (username: string) => {
    setNextLoading(true);
    const res = await fetch("/api/group/deleteMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        delete_member_username: username,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    if (res.error) {
      addNotification({
        id: "delete-error",
        message: "Error deleting member.",
        type: "error",
      });
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
      {me && (
        <div>
          <Typography variant="h5" my={2}>
            {me?.group_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            Share ID:
          </Typography>
          <CopyInput text={me?.group_id || ""} size="small" />
        </div>
      )}
      <BasicDialog forcedOpen={!!infoError} title="Login to view" />
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
              (
                { displayName, is_admin, assigned_to, is_involved, username },
                index
              ) => (
                <ListItem
                  key={index}
                  sx={{
                    px: 0,
                  }}
                >
                  <Typography
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {me?.is_admin && !is_admin && username && (
                        <Tooltip title="Delete member" disableInteractive>
                          <button
                            style={{
                              marginRight: ".5rem",
                              padding: "2px",
                              paddingBottom: "2px",
                              paddingTop: "7px",
                              lineHeight: "8px",
                            }}
                            onClick={() => deleteMember(username)}
                          >
                            ✕
                          </button>
                        </Tooltip>
                      )}
                      {displayName}
                    </span>
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
                    {me?.is_admin &&
                      is_involved &&
                      (assigned_to ? (
                        <Tooltip
                          title={`Assigned to ${assigned_to}`}
                          disableInteractive
                          sx={{
                            cursor: "pointer",
                            ml: ".5rem",
                          }}
                        >
                          <AssignmentIndIcon fontSize="small" />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={`Unassigned`}
                          sx={{
                            cursor: "pointer",
                            ml: ".5rem",
                          }}
                        >
                          <AssignmentLateOutlinedIcon fontSize="small" />
                        </Tooltip>
                      ))}
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
