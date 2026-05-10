import { NextResponse } from "next/server";
import { findUser, readData, writeData } from "@/lib/data";
import { getUsernameFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

function parseTodoId(raw: string): number | null {
  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }
  return value;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const username = getUsernameFromRequest(request);
  if (!username) {
    return unauthorized();
  }

  const { id: rawId } = await context.params;
  const todoId = parseTodoId(rawId);
  if (!todoId) {
    return NextResponse.json({ error: "Invalid todo id." }, { status: 400 });
  }

  const data = await readData();
  const user = findUser(data, username);

  if (!user) {
    return unauthorized();
  }

  const item = user.todos.find((todo) => todo.id === todoId);

  if (!item) {
    return NextResponse.json({ error: "Todo not found." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

  if (!body || (body.title === undefined && body.isCompleted === undefined)) {
    return NextResponse.json(
      { error: "Provide a title or isCompleted to update." },
      { status: 400 }
    );
  }

  const { id: rawId } = await context.params;
  const todoId = parseTodoId(rawId);
  if (!todoId) {
    return NextResponse.json({ error: "Invalid todo id." }, { status: 400 });
  }

  const data = await readData();
  const user = findUser(data, username);

  if (!user) {
    return unauthorized();
  }

  const item = user.todos.find((todo) => todo.id === todoId);

  if (!item) {
    return NextResponse.json({ error: "Todo not found." }, { status: 404 });
  }

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title must be a string." }, { status: 400 });
    }
    item.title = body.title.trim();
  }

  if (body.isCompleted !== undefined) {
    item.isCompleted = Boolean(body.isCompleted);
  }

  await writeData(data);

  return NextResponse.json({ item });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

  if (!body || (body.title === undefined && body.isCompleted === undefined)) {
    return NextResponse.json(
      { error: "Provide a title or isCompleted to update." },
      { status: 400 }
    );
  }

  const { id: rawId } = await context.params;
  const todoId = parseTodoId(rawId);
  if (!todoId) {
    return NextResponse.json({ error: "Invalid todo id." }, { status: 400 });
  }

  const data = await readData();
  const user = findUser(data, username);

  if (!user) {
    return unauthorized();
  }

  const item = user.todos.find((todo) => todo.id === todoId);

  if (!item) {
    return NextResponse.json({ error: "Todo not found." }, { status: 404 });
  }

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title must be a string." }, { status: 400 });
    }
    item.title = body.title.trim();
  }

  if (body.isCompleted !== undefined) {
    item.isCompleted = Boolean(body.isCompleted);
  }

  await writeData(data);

  return NextResponse.json({ item });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const username = getUsernameFromRequest(request);
  if (!username) {
    return unauthorized();
  }

  const { id: rawId } = await context.params;
  const todoId = parseTodoId(rawId);
  if (!todoId) {
    return NextResponse.json({ error: "Invalid todo id." }, { status: 400 });
  }

  const data = await readData();
  const user = findUser(data, username);

  if (!user) {
    return unauthorized();
  }

  const index = user.todos.findIndex((todo) => todo.id === todoId);

  if (index === -1) {
    return NextResponse.json({ error: "Todo not found." }, { status: 404 });
  }

  const [removed] = user.todos.splice(index, 1);
  await writeData(data);

  return NextResponse.json({ item: removed });
}
