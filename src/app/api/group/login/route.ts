import { supabase } from "@/db";
import { withRateLimit } from "@/utils/withRateLimit";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { encrypt } from "@/utils/security";

const secret_key = process.env.SECRET_KEY as string;
const encryption_key = process.env.ENCRYPTION_KEY as string;

async function login(request: Request) {
  const body = await request.json();

  if (!body.group_id || !body.username) {
    return NextResponse.json(
      { error: "Both group_id and username are required" },
      { status: 400 }
    );
  }

  const { group_id, username } = body;

  const { data: groups, error: groupError } = await supabase
    .from("group")
    .select("group_id")
    .eq("group_id", group_id)
    .limit(1);

  if (groupError || !groups || groups.length === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const { data: members, error: memberError } = await supabase
    .from("member")
    .select("username")
    .eq("group_id", group_id)
    .eq("username", username)
    .limit(1);

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  if (!members || members.length === 0) {
    return NextResponse.json(
      { error: "Username not found in the group" },
      { status: 404 }
    );
  }

  const token = jwt.sign({ username, group_id }, secret_key, {
    expiresIn: "1h",
  });

  const encryptedToken = encrypt(token, encryption_key);

  const cookie = `token=${encryptedToken}; Path=/; HttpOnly; Secure; SameSite=Strict`;

  return NextResponse.json(
    {
      message: "Login successful",
    },
    { status: 200, headers: { "Set-Cookie": cookie } }
  );
}

export const POST = withRateLimit(login);
