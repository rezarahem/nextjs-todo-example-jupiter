'use server';

import { createTodo } from '@/actions/create-todo';

export const CreateTodo = async (id: number, todo: string) => {
  return await createTodo(id, todo);
};
