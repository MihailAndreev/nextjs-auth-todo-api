# TODO List API (Next.js + JWT)

This project is a simple TODO list API server built with Next.js and TypeScript. User data and TODO items are stored in `data/app-data.json`.

## Getting Started

```bash
npm run dev
```

Open http://localhost:3000 for links to the auth UI, TODOs UI, and API docs.
The API docs live at http://localhost:3000/docs.

## Auth Endpoints

- `POST /api/auth/register`
	- Body: `{ "username": "alice", "password": "password" }`
	- Returns: `{ "token": "..." }`
- `POST /api/auth/login`
	- Body: `{ "username": "alice", "password": "password" }`
	- Returns: `{ "token": "..." }`

## Todo Endpoints (JWT required)

Send `Authorization: Bearer <token>` with each request.

- `GET /api/todos` - list TODO items
- `POST /api/todos` - create TODO item
	- Body: `{ "title": "Buy milk", "isCompleted": false }`
- `GET /api/todos/[id]` - view TODO item
- `PUT /api/todos/[id]` - edit TODO item
	- Body: `{ "title": "Buy milk", "isCompleted": true }`
- `PATCH /api/todos/[id]` - partially update TODO item
	- Body: `{ "title": "Buy milk", "isCompleted": true }`
- `DELETE /api/todos/[id]` - delete TODO item

The `id` value returned with TODO items is used as the identifier in the route.

## Data Model

- Users: `username`, `passwordHash`, `nextTodoId`, `todos[]`
- Todo items: `id`, `title`, `isCompleted`, `createdDate`

## Environment

Set `JWT_SECRET` to control the signing secret for tokens.
