import { supabase } from "@/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.share_id || !body.username) {
    return NextResponse.json(
      { error: "Both share_id and username are required" },
      { status: 400 }
    );
  }
  const { share_id, username } = body;

  const { data: groups, error: groupError } = await supabase
    .from("group")
    .select("id")
    .eq("share_id", share_id)
    .limit(1);

  if (groupError || !groups || groups.length === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const group_id = groups[0].id;

  const { data: members, error: memberError } = await supabase
    .from("member")
    .select("display_name")
    .eq("group_id", group_id)
    .eq("username", username)
    .limit(1);

  if (memberError || !members || members.length === 0) {
    return NextResponse.json(
      { error: "Member not found in the group" },
      { status: 404 }
    );
  }

  const { data: allMembers, error: allMembersError } = await supabase
    .from("member")
    .select("display_name")
    .eq("group_id", group_id);

  if (allMembersError) {
    return NextResponse.json(
      { error: allMembersError.message },
      { status: 500 }
    );
  }

  const memberNames = allMembers?.map((member) => member.display_name);

  return NextResponse.json({ members: memberNames });
}
