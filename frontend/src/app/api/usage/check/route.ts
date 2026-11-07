import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUsageLimit } from "@/lib/usage";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Get IP for guest tracking
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const { searchParams } = new URL(req.url);
    const needed = parseInt(searchParams.get("needed") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");

    const result = await checkUsageLimit(userId, ip, needed, limit);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
