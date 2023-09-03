import { supabase } from "@/db";
import { withRateLimit } from "@/utils/withRateLimit";
import { NextResponse } from "next/server";

async function getGroupName(request: Request) {
  const body = await request.json();

  if (!body.group_id) {
    return NextResponse.json(
      { error: "group_id is required" },
      { status: 400 }
    );
  }

  const { group_id } = body;

  const { data: groups, error } = await supabase
    .from("group")
    .select("group_name")
    .eq("group_id", group_id)
    .limit(1);

  if (error || !groups || groups.length === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const group_name = groups[0].group_name;

  return NextResponse.json({ groupName: group_name });
}

export const POST = withRateLimit(getGroupName);
