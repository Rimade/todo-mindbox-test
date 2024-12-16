import { act, renderHook } from '@testing-library/react';
import { useTodoStore } from './useTodoStore';
import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '@/lib/axios';

describe('useTodoStore', () => {
  const mock = new MockAdapter(axiosInstance);

  afterEach(() => {
    mock.reset();
  });

  it('fetches todos correctly', async () => {
    const mockTodos = [
      { id: '1', text: 'Test Todo 1', completed: false },
      { id: '2', text: 'Test Todo 2', completed: true },
    ];

    // Используем правильный URL для мока
    mock.onGet('/items').reply(200, mockTodos);

    const { result } = renderHook(() => useTodoStore());

    // Вызываем fetchTodos и проверяем результат
    await act(async () => {
      await result.current.fetchTodos();
    });

    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.loading).toBe(false);
  });
});
