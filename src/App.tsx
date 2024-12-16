import { useEffect, useState } from 'react';
import { useTodoStore } from './store/useTodoStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Trash2Icon } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed';

const App = () => {
  const {
    todos,
    loading,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos,
  } = useTodoStore();
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<FilterType>('all'); // состояние для фильтра

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = () => {
    if (newTask.trim()) {
      addTodo(newTask);
      setNewTask('');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTasksCount = todos.filter((todo) => !todo.completed).length;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5">
      <h1 className="text-6xl font-thin text-center text-gray-200 mb-10 tracking-widest">
        Mindbox Test
      </h1>

      <div className="shadow-lg">
        <div className="flex gap-2 items-center mb-5">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Что нужно сделать?"
            className="p-5 text-lg border-gray-300 rounded focus:outline-none"
          />
          <Button variant="default" onClick={handleAdd} className="py-5 px-4">
            Добавить
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton height={50} />
            <Skeleton height={50} />
            <Skeleton height={50} />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center bg-white p-3 mt-5 rounded shadow">
              <span className="text-sm text-gray-500">
                {activeTasksCount > 0 ? (
                  <span>
                    {activeTasksCount}{' '}
                    {activeTasksCount === 1 ? 'item ' : 'items '}left
                  </span>
                ) : (
                  'Нет активных задач'
                )}
              </span>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={clearCompletedTodos}
                className="text-red-500 hover:text-red-700"
              >
                Clear completed
              </Button>
            </div>

            <ul className="space-y-3 bg-white rounded shadow-md">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between border-b p-3 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() =>
                        toggleTodo(todo.id, todo.completed)
                      }
                    />
                    <span
                      className={`text-lg ${
                        todo.completed ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon className="size-5" />
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
