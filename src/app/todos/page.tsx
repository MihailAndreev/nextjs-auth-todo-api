"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./todos.module.css";

const tokenKey = "todoApiToken";

type TodoItem = {
  id: number;
  title: string;
  isCompleted: boolean;
  createdDate: string;
};

type ApiResponse = {
  items?: TodoItem[];
  item?: TodoItem;
  error?: string;
};

export default function TodosPage() {
  const [token, setToken] = useState<string | null>(null);
  const [items, setItems] = useState<TodoItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(() => {
    if (!token) {
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [token]);

  useEffect(() => {
    const stored = localStorage.getItem(tokenKey);
    if (stored) {
      setToken(stored);
    }
  }, []);

  useEffect(() => {
    if (token) {
      void loadTodos();
    }
  }, [token]);

  async function loadTodos() {
    if (!headers) {
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/todos", { headers });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        handleAuthError(data.error);
        return;
      }

      setItems(data.items || []);
    } catch {
      setMessage("Failed to load todos.");
    } finally {
      setLoading(false);
    }
  }

  function handleAuthError(error?: string) {
    if (error) {
      setMessage(error);
    }
    if (error && error.toLowerCase().includes("unauthorized")) {
      localStorage.removeItem(tokenKey);
      setToken(null);
    }
  }

  async function addTodo() {
    if (!headers) {
      setMessage("Please login first.");
      return;
    }

    const title = newTitle.trim();
    if (!title) {
      return;
    }

    setMessage("");
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers,
        body: JSON.stringify({ title, isCompleted: false }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        handleAuthError(data.error);
        return;
      }

      setNewTitle("");
      const newItem = data.item;
      if (!newItem) {
        void loadTodos();
        return;
      }

      setItems((prev) => [newItem, ...prev]);
    } catch {
      setMessage("Failed to add todo.");
    }
  }

  async function toggleTodo(item: TodoItem) {
    if (!headers) {
      return;
    }

    try {
      const response = await fetch(`/api/todos/${item.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ isCompleted: !item.isCompleted }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        handleAuthError(data.error);
        return;
      }

      const updatedItem = data.item;
      if (!updatedItem) {
        return;
      }

      setItems((prev) =>
        prev.map((todo) => (todo.id === item.id ? updatedItem : todo))
      );
    } catch {
      setMessage("Failed to update todo.");
    }
  }

  function startEdit(item: TodoItem) {
    setEditingId(item.id);
    setEditingTitle(item.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function saveEdit(item: TodoItem) {
    if (!headers) {
      return;
    }

    const title = editingTitle.trim();
    if (!title) {
      setMessage("Title cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/api/todos/${item.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ title }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        handleAuthError(data.error);
        return;
      }

      const updatedItem = data.item;
      if (!updatedItem) {
        return;
      }

      setItems((prev) =>
        prev.map((todo) => (todo.id === item.id ? updatedItem : todo))
      );
      cancelEdit();
    } catch {
      setMessage("Failed to update todo.");
    }
  }

  async function deleteTodo(item: TodoItem) {
    if (!headers) {
      return;
    }

    try {
      const response = await fetch(`/api/todos/${item.id}`, {
        method: "DELETE",
        headers,
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        handleAuthError(data.error);
        return;
      }

      setItems((prev) => prev.filter((todo) => todo.id !== item.id));
    } catch {
      setMessage("Failed to delete todo.");
    }
  }

  function logout() {
    localStorage.removeItem(tokenKey);
    setToken(null);
    setItems([]);
    setMessage("Logged out.");
  }

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Todos</h1>
            <div className={styles.headerActions}>
              <Link href="/auth">Login</Link>
              <Link href="/docs">Docs</Link>
            </div>
          </div>
          <p className={styles.muted}>Login to access your TODO list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Todos</h1>
          <div className={styles.headerActions}>
            <button type="button" onClick={logout}>
              Logout
            </button>
            <Link href="/docs">Docs</Link>
            <Link href="/">Home</Link>
          </div>
        </div>

        <div className={styles.addRow}>
          <input
            type="text"
            placeholder="Add a new TODO..."
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
          <button type="button" onClick={addTodo}>
            Add
          </button>
        </div>

        {message && <div className={styles.message}>{message}</div>}

        {loading ? (
          <p className={styles.muted}>Loading...</p>
        ) : items.length === 0 ? (
          <p className={styles.empty}>No TODOs yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Done</th>
                <th>Title</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() => toggleTodo(item)}
                    />
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        className={styles.titleInput}
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                      />
                    ) : (
                      item.title
                    )}
                  </td>
                  <td className={styles.muted}>
                    {new Date(item.createdDate).toLocaleString()}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {editingId === item.id ? (
                        <>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => saveEdit(item)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => startEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionButton} ${styles.danger}`}
                            onClick={() => deleteTodo(item)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
