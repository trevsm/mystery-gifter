import { supabase } from "@/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { decrypt } from "@/utils/security";
import { getCookie } from "@/utils/getCookie";

const encrypted_key = process.env.ENCRYPTION_KEY as string;
const secret_key = process.env.SECRET_KEY as string;

async function getMembers(request: Request) {
  const encryptedToken = getCookie("token", request);

  if (!encryptedToken) {
    return NextResponse.json(
      { error: "Authorization token is required" },
      { status: 401 }
    );
  }

  const decryptedToken = decrypt(encryptedToken, encrypted_key);

  let decoded;
  try {
    decoded = jwt.verify(decryptedToken, secret_key);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const { username, group_id } = decoded as any;

  const { data: userInGroup, error } = await supabase
    .from("member")
    .select("username")
    .eq("username", username)
    .eq("group_id", group_id)
    .limit(1);

  if (error || !userInGroup || userInGroup.length === 0) {
    return NextResponse.json(
      { error: "User not found in group" },
      { status: 403 }
    );
  }

  const { data: members, error: fetchError } = await supabase
    .from("member")
    .select("display_name, is_admin, is_involved")
    .eq("group_id", group_id);

  if (fetchError || !members) {
    return NextResponse.json(
      { error: "Could not fetch members" },
      { status: 500 }
    );
  }

  const memberList = members.map(({ display_name, is_admin, is_involved }) => ({
    displayName: display_name,
    is_involved,
    is_admin,
  }));

  return NextResponse.json({ members: memberList });
}

export const POST = getMembers;
