import { NextResponse } from "next/server";
import { findUser, readData } from "@/lib/data";
import { signToken, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { username?: string; password?: string } | null = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  const username = body.username.trim();
  const password = body.password;

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  const data = await readData();
  const user = findUser(data, username);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = signToken(username);
  return NextResponse.json({ token });
}
