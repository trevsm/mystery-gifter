import { supabase } from "@/db";
import { withRateLimit } from "@/utils/withRateLimit";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

async function newGroup(request: Request) {
  const body = await request.json();

  if (!body.group_name || !body.username) {
    return NextResponse.json(
      { error: "Group name, username are required" },
      { status: 400 }
    );
  }

  const { group_name, username, display_name } = body;

  if (group_name.length > 30)
    return NextResponse.json(
      { error: "Group name is too long: max 30" },
      { status: 400 }
    );

  const is_involved = body.is_involved;

  const group_id = uuidv4().substring(0, 6);

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

  const { error: groupError } = await supabase
    .from("group")
    .insert([{ group_id, group_name }]);

  if (groupError) {
    return NextResponse.json({ error: groupError.message }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("member").insert([
    {
      username,
      is_admin: true,
      group_id,
      is_involved,
      display_name,
    },
  ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ group_id });
}

export const POST = withRateLimit(newGroup);
