import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import CheckIcon from "@mui/icons-material/Check";
import { TextField } from "@mui/material";

export default function GroupInputLookup({
  foundGroupState,
  shareIdState,
  loadingState,
  errorState,
}: {
  foundGroupState: [string, React.Dispatch<React.SetStateAction<string>>];
  shareIdState: [string, React.Dispatch<React.SetStateAction<string>>];
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  errorState: [
    string | undefined,
    React.Dispatch<React.SetStateAction<string | undefined>>
  ];
}) {
  const [foundGroup, setFoundGroup] = foundGroupState;
  const [shareId, setShareId] = shareIdState;
  const [_, setLoading] = loadingState;
  const [__, setError] = errorState;

  const debouncedShareId = useDebounce<string>(shareId, 500);

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
      if (data.groupName) {
        setFoundGroup(data.groupName);
      } else {
        setFoundGroup("");
        setError(data.error);
      }
    };

    if (debouncedShareId && !foundGroup) {
      getGroupNameFromId(debouncedShareId);
    }
  }, [debouncedShareId, foundGroup]);

  return (
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
  shareId?: string;
  foundGroup?: string;
  loading?: boolean;
  error?: string;
}

export const actionButtonProps = ({
  defaultLabel,
  shareId,
  foundGroup,
  loading,
  error,
}: ActionButtonProps) => {
  let label = "Enter a group ID";

  if (loading || (shareId && !foundGroup && !error)) label = "Loading...";
  if (foundGroup) label = defaultLabel;
  if (!loading && !foundGroup && error) label = "Group not found";

  const disabled = label !== defaultLabel;

  return {
    label,
    disabled,
  };
};
