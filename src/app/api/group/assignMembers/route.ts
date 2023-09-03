import { supabase } from "@/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { decrypt } from "@/utils/security";
import { getCookie } from "@/utils/getCookie";

const encrypted_key = process.env.ENCRYPTION_KEY as string;
const secret_key = process.env.SECRET_KEY as string;

async function getInfo(request: Request) {
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
    .select("username, is_admin, is_involved")
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
    .select("username, display_name, is_admin, is_involved")
    .eq("group_id", group_id);

  if (fetchError || !members) {
    return NextResponse.json(
      { error: "Could not fetch members" },
      { status: 500 }
    );
  }

  let memberPool = members.filter((member) => member.is_involved);

  // go through each member and assign them a random member,
  // then remove that member from the pool

  const assignments = memberPool.map((member) => {
    const randomIndex = Math.floor(Math.random() * memberPool.length);
    const randomMember = memberPool[randomIndex];
    memberPool = memberPool.filter(
      (member) => member.username !== randomMember.username
    );
    return {
      giver: member.username,
      receiver: randomMember.display_name,
    };
  });

  // // for each assignment, update the database
  for (const { giver, receiver } of assignments) {
    const { error: updateError } = await supabase
      .from("member")
      .update({ assigned_to: receiver })
      .eq("username", giver)
      .eq("group_id", group_id);
    if (updateError) {
      return NextResponse.json(
        { error: "Could not update member" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    message: "Successfully assigned members",
  });
}

export const POST = getInfo;
