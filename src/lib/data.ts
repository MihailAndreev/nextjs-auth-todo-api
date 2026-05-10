import { promises as fs } from "fs";
import path from "path";
import { AppData, TodoItem, UserRecord } from "./types";

const dataFilePath = path.join(process.cwd(), "data", "app-data.json");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    const initial: AppData = { users: [] };
    await fs.writeFile(dataFilePath, JSON.stringify(initial, null, 2), "utf-8");
  }
}

export async function readData(): Promise<AppData> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFilePath, "utf-8");
  const data = JSON.parse(raw) as AppData;

  if (!Array.isArray(data.users)) {
    data.users = [];
  }

  data.users = data.users.map((user) => normalizeUser(user));

  return data;
}

export async function writeData(data: AppData): Promise<void> {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}

export function findUser(data: AppData, username: string): UserRecord | undefined {
  return data.users.find((user) => user.username === username);
}

function normalizeUser(user: UserRecord): UserRecord {
  const safeUser = user as UserRecord;
  const todos = Array.isArray(safeUser.todos) ? safeUser.todos : [];
  let maxId = 0;

  todos.forEach((todo) => {
    if (typeof todo.id === "number" && Number.isInteger(todo.id) && todo.id > 0) {
      maxId = Math.max(maxId, todo.id);
    }
  });

  let nextId = maxId + 1;
  const normalizedTodos = todos.map((todo) => {
    const normalized = todo as TodoItem;
    if (
      typeof normalized.id !== "number" ||
      !Number.isInteger(normalized.id) ||
      normalized.id <= 0
    ) {
      normalized.id = nextId;
      nextId += 1;
    }
    maxId = Math.max(maxId, normalized.id);
    return normalized;
  });

  const currentNextTodoId =
    typeof safeUser.nextTodoId === "number" &&
    Number.isInteger(safeUser.nextTodoId) &&
    safeUser.nextTodoId > 0
      ? safeUser.nextTodoId
      : 0;

  safeUser.todos = normalizedTodos;
  safeUser.nextTodoId = Math.max(currentNextTodoId, maxId + 1);

  return safeUser;
}
