import { NextResponse } from "next/server";
import { findUser, readData, writeData } from "@/lib/data";
import { getUsernameFromRequest } from "@/lib/auth";
import { TodoItem } from "@/lib/types";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET(request: Request) {
  const username = getUsernameFromRequest(request);
  if (!username) {
    return unauthorized();
  }

  const data = await readData();
  const user = findUser(data, username);

  if (!user) {
    return unauthorized();
  }

  return NextResponse.json({ items: user.todos });
}

export async function POST(request: Request) {
  const username = getUsernameFromRequest(request);
  if (!username) {
    return unauthorized();
  }

  let body: { title?: string; isCompleted?: boolean } | null = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body.title !== "string") {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const title = body.title.trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const data = await readData();
  const user = findUser(data, username);

  if (!user) {
    return unauthorized();
  }

  const item: TodoItem = {
    id: user.nextTodoId,
    title,
    isCompleted: Boolean(body.isCompleted),
    createdDate: new Date().toISOString(),
  };

  user.nextTodoId += 1;
  user.todos.push(item);
  await writeData(data);

  return NextResponse.json({ item }, { status: 201 });
}
