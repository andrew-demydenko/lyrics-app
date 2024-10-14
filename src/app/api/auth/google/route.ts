import { AuthService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  const response = NextResponse.redirect("/songs");
  AuthService.setAccessToken(token, response);

  return response;
}
