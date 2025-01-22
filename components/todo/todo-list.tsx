'use client';

import { userIdAtom } from '@/jotai/user-id-atom';
import { CreateTodo } from '@/server-actions/create-todo';
import { DeleteTodo } from '@/server-actions/delete-todo';
import { GetTodos } from '@/server-actions/get-todos';
import { Button, Input } from '@heroui/react';
import { useAtomValue } from 'jotai';
import { ArrowRight, Trash } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';

type Todo = {
  id: number;
  body: string;
};

const TodoList = () => {
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const userId = useAtomValue(userIdAtom);

  useEffect(() => {
    if (!isMounted) setIsMounted(true);
  }, [isMounted, setIsMounted]);

  useEffect(() => {
    if (!isMounted || !userId) return;

    const get = async () => {
      try {
        const todos = await GetTodos(userId);
        setTodos(todos);
      } catch {
        toast.error('Something went wrong');
      }
    };

    get();
  }, [userId, isMounted, setTodos]);

  if (!isMounted) {
    return <div>Mounting...</div>;
  }

  const onDelete = (id: number) => {
    startTransition(async () => {
      const res = await DeleteTodo(id);

      if (res) {
        setTodos(prev => prev.filter(t => t.id !== id));
        toast.success('Todo deleted succesfully');
      }
    });
  };

  const onSubmit = () => {
    startTransition(async () => {
      const res = await CreateTodo(userId, newTodo);

      if (res) {
        setNewTodo('');
        setTodos(prev => [...prev, res]);
        toast.success('New todo added');
      }
    });
  };

  return (
    <div>
      <div className='flex gap-2'>
        <Input
          value={newTodo}
          onChange={e => {
            setNewTodo(e.target.value);
          }}
          placeholder='Enter a todo...'
        />
        <Button
          isLoading={isPending}
          onPress={onSubmit}
          isDisabled={!newTodo.length}
          isIconOnly>
          {!isPending && <ArrowRight />}
        </Button>
      </div>
      <div className='border-b my-4'></div>
      <div>
        {todos.length === 0 ? (
          <div className='text-center font-bold'>No Todo, Add one</div>
        ) : (
          <div className='space-y-2'>
            {todos.map(t => (
              <div key={t.id} className='flex items-center gap-2'>
                <Button
                  onPress={() => onDelete(t.id)}
                  isLoading={isPending}
                  size='sm'
                  isIconOnly
                  color='danger'
                  variant='ghost'>
                  <Trash />
                </Button>
                <div>{t.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
