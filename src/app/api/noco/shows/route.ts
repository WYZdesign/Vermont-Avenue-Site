import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table") || "Shows";
  const limit = searchParams.get("limit") || "50";

  const nocodbUrl = process.env.NOCODB_URL || "https://noco.wyzmind.tech";
  const nocodbToken = process.env.NOCODB_API_TOKEN;
  const nocodbBase = process.env.NOCODB_BASE_ID;

  if (!nocodbToken || !nocodbBase) {
    return NextResponse.json(
      { error: "NocoDB not configured" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `${nocodbUrl}/api/v1/db/meta/bases/${nocodbBase}/tables/${table}/records?limit=${limit}`,
      {
        headers: {
          "xc-token": nocodbToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `NocoDB returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach NocoDB" },
      { status: 500 }
    );
  }
}