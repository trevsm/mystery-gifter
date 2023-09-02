import { supabase } from "@/db";
import { withRateLimit } from "@/utils/withRateLimit";
import { NextResponse } from "next/server";

async function getGroupName(request: Request) {
  const body = await request.json();

  if (!body.share_id) {
    return NextResponse.json(
      { error: "share_id is required" },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const { share_id } = body;

  const { data: groups, error } = await supabase
    .from("group")
    .select("group_name")
    .eq("share_id", share_id)
    .limit(1);

  if (error || !groups || groups.length === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const group_name = groups[0].group_name;

  return NextResponse.json({ groupName: group_name });
}

export const POST = withRateLimit(getGroupName);
