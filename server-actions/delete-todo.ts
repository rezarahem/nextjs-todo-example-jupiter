'use server';

import { deleteTodo } from '@/actions/delete-todo';

export const DeleteTodo = async (id: number) => {
  return await deleteTodo(id);
};
