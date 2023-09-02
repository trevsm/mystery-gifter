import { supabase } from "@/db";
import { withRateLimit } from "@/utils/withRateLimit";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { encrypt } from "@/utils/security";

const secret_key = process.env.SECRET_KEY as string;
const encryption_key = process.env.ENCRYPTION_KEY as string;

async function joinGroup(request: Request) {
  const body = await request.json(); // Parse the request body

  if (!body.share_id || !body.username || !body.display_name) {
    return NextResponse.json(
      { error: "share_id, username, and display_name are required" },
      { status: 400 }
    );
  }

  const { share_id, username, display_name } = body;

  const { data: groups, error: groupError } = await supabase
    .from("group")
    .select("id")
    .eq("share_id", share_id)
    .limit(1);

  if (groupError || !groups || groups.length === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const group_id = groups[0].id;

  const { data: existingMembers, error: existingMemberError } = await supabase
    .from("member")
    .select("username")
    .eq("username", username)
    .limit(1);

  if (existingMemberError) {
    return NextResponse.json(
      { error: existingMemberError.message },
      { status: 500 }
    );
  }

  if (existingMembers && existingMembers.length > 0) {
    return NextResponse.json(
      { error: "Username already exists" },
      { status: 409 }
    );
  }

  const { error: insertError } = await supabase
    .from("member")
    .insert([{ display_name, username, group_id }]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const token = jwt.sign({ username, group_id }, secret_key, {
    expiresIn: "1h",
  });

  const encryptedToken = encrypt(token, encryption_key);

  const cookie = `token=${encryptedToken}; Path=/; HttpOnly; Secure; SameSite=Strict`;

  return NextResponse.json(
    {
      message: "Join successful",
    },
    { status: 200, headers: { "Set-Cookie": cookie } }
  );
}

export const POST = withRateLimit(joinGroup);
