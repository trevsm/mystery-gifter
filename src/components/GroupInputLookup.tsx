import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import CheckIcon from "@mui/icons-material/Check";
import { TextField } from "@mui/material";

export default function GroupInputLookup({
  foundGroupState,
  groupIdState,
  loadingState,
  errorState,
}: {
  foundGroupState: [string, React.Dispatch<React.SetStateAction<string>>];
  groupIdState: [string, React.Dispatch<React.SetStateAction<string>>];
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  errorState: [
    string | undefined,
    React.Dispatch<React.SetStateAction<string | undefined>>
  ];
}) {
  const [foundGroup, setFoundGroup] = foundGroupState;
  const [groupId, setgroupId] = groupIdState;
  const [_, setLoading] = loadingState;
  const [__, setError] = errorState;

  const debouncedgroupId = useDebounce<string>(groupId, 1500);

  useEffect(() => {
    const getGroupNameFromId = async (id: string) => {
      setLoading(true);

      const response = await fetch(`/api/group/getGroupName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ group_id: id }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.groupName) {
        setFoundGroup(data.groupName);
      } else {
        setFoundGroup("");
        setError(data.error);
      }
    };

    if (debouncedgroupId && !foundGroup) {
      getGroupNameFromId(debouncedgroupId);
    }
  }, [debouncedgroupId, foundGroup]);

  return (
    <TextField
      label={foundGroup ? groupId : "Group ID"}
      type="text"
      value={foundGroup || groupId}
      onChange={(e) => {
        setError("");
        setFoundGroup("");
        setgroupId(e.target.value);
      }}
      sx={{
        mb: foundGroup ? 0 : 2,
        mt: 1,
      }}
      size="small"
      disabled={!!foundGroup}
      InputProps={{
        endAdornment: foundGroup ? <CheckIcon sx={{ color: "green" }} /> : "",
      }}
    />
  );
}

interface ActionButtonProps {
  defaultLabel: string;
  groupId?: string;
  foundGroup?: string;
  loading?: boolean;
  error?: string;
}

export const actionButtonProps = ({
  defaultLabel,
  groupId,
  foundGroup,
  loading,
  error,
}: ActionButtonProps) => {
  let label = "Enter a group ID";

  if (loading || (groupId && !foundGroup && !error)) label = "Loading...";
  if (foundGroup) label = defaultLabel;
  if (!loading && !foundGroup && error) label = "Group not found";

  const disabled = label !== defaultLabel;

  return {
    label,
    disabled,
  };
};
