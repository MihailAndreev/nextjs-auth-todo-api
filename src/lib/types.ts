export type TodoItem = {
  id: number;
  title: string;
  isCompleted: boolean;
  createdDate: string;
};

export type UserRecord = {
  username: string;
  passwordHash: string;
  nextTodoId: number;
  todos: TodoItem[];
};

export type AppData = {
  users: UserRecord[];
};
