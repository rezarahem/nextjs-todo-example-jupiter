'use server';

import { getTodos } from '@/actions/get-todos';

export const GetTodos = async (userId: number) => {
  return getTodos(userId);
};
