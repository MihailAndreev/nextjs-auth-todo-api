"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";

const tokenKey = "todoApiToken";

type AuthMode = "login" | "register";

type ApiResponse = {
  token?: string;
  error?: string;
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(tokenKey);
    if (stored) {
      setToken(stored);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.token) {
        setMessage(data.error || "Auth failed.");
        return;
      }

      localStorage.setItem(tokenKey, data.token);
      setToken(data.token);
      setUsername("");
      setPassword("");
      router.push("/todos");
    } catch {
      setMessage("Request failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(tokenKey);
    setToken(null);
    setMessage("Logged out.");
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Auth</h1>
          <p>Login or create an account to manage your TODO list.</p>
        </header>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            Username
            <input
              className={styles.input}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            Password
            <input
              className={styles.input}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <div className={styles.actions}>
            <button className={styles.primary} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </button>
            {token && (
              <button
                className={styles.secondary}
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </form>

        {message && <div className={styles.message}>{message}</div>}

        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/todos">Todos</Link>
          <Link href="/docs">Docs</Link>
        </nav>
      </div>
    </div>
  );
}
