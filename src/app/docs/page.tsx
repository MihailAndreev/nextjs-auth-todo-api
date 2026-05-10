import styles from "./page.module.css";

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Next.js + JWT</p>
          <h1>TODO List API</h1>
          <p className={styles.lead}>
            File-backed TODO API with per-user items. Register or login to get a
            JWT token and send it with requests.
          </p>
        </header>

        <section className={styles.section}>
          <h2>Auth</h2>
          <ul className={styles.list}>
            <li>
              <span className={styles.method}>POST</span>
              <code>/api/auth/register</code> Create a user and return a token.
            </li>
            <li>
              <span className={styles.method}>POST</span>
              <code>/api/auth/login</code> Login and return a token.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Todos (JWT required)</h2>
          <p className={styles.note}>
            Send header <code>Authorization: Bearer &lt;token&gt;</code>. Use the
            TODO <code>id</code> value as the identifier in the routes below.
          </p>
          <ul className={styles.list}>
            <li>
              <span className={styles.method}>GET</span>
              <code>/api/todos</code> List TODO items.
            </li>
            <li>
              <span className={styles.method}>POST</span>
              <code>/api/todos</code> Create a TODO item.
            </li>
            <li>
              <span className={styles.method}>GET</span>
              <code>/api/todos/[id]</code> View one TODO item.
            </li>
            <li>
              <span className={styles.method}>PUT</span>
              <code>/api/todos/[id]</code> Edit a TODO item.
            </li>
            <li>
              <span className={styles.method}>PATCH</span>
              <code>/api/todos/[id]</code> Partially update a TODO item.
            </li>
            <li>
              <span className={styles.method}>DELETE</span>
              <code>/api/todos/[id]</code> Delete a TODO item.
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2>Data model</h2>
          <p className={styles.note}>
            Data is stored in <code>data/app-data.json</code>. Users are stored
            with a <code>username</code>, <code>passwordHash</code>,
            <code>nextTodoId</code>, and a <code>todos</code> array. TODO items
            include an id, title, completion flag, and created date.
          </p>
        </section>
      </main>
    </div>
  );
}
