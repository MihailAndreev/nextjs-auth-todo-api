import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.badge}>TODO CONTROL</p>
          <h1>One API, One Client, Zero Chaos.</h1>
          <p className={styles.subtitle}>
            Jump into the auth flow, manage your TODOs, or browse the API docs.
            Everything runs inside the same Next.js app.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/todos">
              Open Todos
            </Link>
            <Link className={styles.secondary} href="/auth">
              Login or Register
            </Link>
          </div>
        </header>

        <section className={styles.grid}>
          <Link className={styles.card} href="/auth">
            <h2>Auth</h2>
            <p>Register, login, and logout with JWT tokens.</p>
          </Link>
          <Link className={styles.card} href="/todos">
            <h2>Todos</h2>
            <p>Edit, toggle, and delete TODOs inline.</p>
          </Link>
          <Link className={styles.card} href="/docs">
            <h2>Docs</h2>
            <p>Review every API endpoint and payload.</p>
          </Link>
        </section>
      </main>
    </div>
  );
}
