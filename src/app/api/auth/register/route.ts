import { NextResponse } from "next/server";
import { findUser, readData, writeData } from "@/lib/data";
import { hashPassword, signToken } from "@/lib/auth";

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

  if (findUser(data, username)) {
    return NextResponse.json(
      { error: "Username already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  data.users.push({ username, passwordHash, nextTodoId: 1, todos: [] });
  await writeData(data);

  const token = signToken(username);

  return NextResponse.json({ token }, { status: 201 });
}
