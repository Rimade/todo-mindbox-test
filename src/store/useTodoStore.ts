import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoStore = {
  todos: Todo[];
  loading: boolean;
  fetchTodos: () => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string, completed: boolean) => void;
  deleteTodo: (id: string) => void;
  clearCompletedTodos: () => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  loading: false,

  // Получение всех задач с сервера
  fetchTodos: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get(`/items`);
      set({ todos: data });
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Добавление задачи
  addTodo: async (text) => {
    try {
      const newTodo = { text, completed: false };
      const { data } = await axiosInstance.post(`/items`, newTodo);
      set((state) => ({ todos: [...state.todos, data] }));
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  },

  // Переключение статуса задачи
  toggleTodo: async (id, completed) => {
    try {
      await axiosInstance.patch(`/items/${id}`, {
        completed: !completed,
      });
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      }));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  },

  // Удаление задачи
  deleteTodo: async (id) => {
    try {
      await axiosInstance.delete(`/items/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  },

  // Удаление выполненных задач
  clearCompletedTodos: async () => {
    try {
      const completedTodoIds = get()
        .todos.filter((todo) => todo.completed)
        .map((todo) => todo.id);
      await Promise.all(
        completedTodoIds.map((id) => axiosInstance.delete(`/items/${id}`)),
      );
      set((state) => ({
        todos: state.todos.filter((todo) => !todo.completed),
      }));
    } catch (error) {
      console.error('Failed to clear completed todos:', error);
    }
  },
}));
