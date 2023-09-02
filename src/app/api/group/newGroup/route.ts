import { supabase } from "@/db";
import { withRateLimit } from "@/utils/withRateLimit";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function newGroup(request: Request) {
  const body = await request.json();

  if (!body.group_name || !body.username) {
    return NextResponse.json(
      { error: "Group name, username are required" },
      { status: 400 }
    );
  }

  const { group_name, username, display_name } = body;

  const isInvolved = body.isInvolved;

  const share_id = uuidv4().substring(0, 6);

  const { error } = await supabase
    .from("group")
    .insert([{ group_name, share_id }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: groups, error: groupError } = await supabase
    .from("group")
    .select()
    .eq("share_id", share_id)
    .limit(1);

  if (!groups || groups.length === 0) {
    return NextResponse.json({ error: "Group error..." }, { status: 404 });
  }

  const groupId = groups[0].id;

  const { error: insertError } = await supabase
    .from("member")
    .insert([
      { username, isAdmin: true, group_id: groupId, isInvolved, display_name },
    ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ share_id });
}

export const POST = withRateLimit(newGroup);
