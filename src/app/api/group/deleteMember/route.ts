import { supabase } from "@/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { decrypt } from "@/utils/security";
import { getCookie } from "@/utils/getCookie";

const encrypted_key = process.env.ENCRYPTION_KEY as string;
const secret_key = process.env.SECRET_KEY as string;

async function deleteMember(request: Request) {
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

  if (!userInGroup[0].is_admin) {
    return NextResponse.json(
      { error: "User is not an admin" },
      { status: 403 }
    );
  }

  const body = await request.json();

  if (!body.delete_member_username) {
    return NextResponse.json(
      { error: "delete_member_username is required" },
      { status: 400 }
    );
  }

  const { delete_member_username } = body;

  const { data: memberToDelete, error: memberError } = await supabase
    .from("member")
    .select("username, display_name, is_admin, is_involved")
    .eq("username", delete_member_username)
    .eq("group_id", group_id)
    .limit(1);

  if (memberError || !memberToDelete || memberToDelete.length === 0) {
    return NextResponse.json(
      { error: "Member not found in group" },
      { status: 404 }
    );
  }

  if (memberToDelete[0].is_admin) {
    return NextResponse.json(
      { error: "Cannot delete an admin" },
      { status: 403 }
    );
  }

  const { error: deleteError } = await supabase
    .from("member")
    .delete()
    .eq("username", delete_member_username)
    .eq("group_id", group_id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Could not delete member" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export const POST = deleteMember;
