import { supabase } from "@/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.group_name || !body.username || !body.display_name) {
    return NextResponse.json(
      { error: "Group name, username, and display name are required" },
      { status: 400 }
    );
  }

  const { group_name, display_name, username } = body;

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
    .insert([{ display_name, username, isAdmin: true, group_id: groupId }]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ share_id });
}
