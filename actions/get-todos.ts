import 'server-only';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { Todo } from '@/drizzle';

export const getTodos = async (userId: number) => {
  const todos = await db.query.Todo.findMany({
    columns: {
      userId: false,
    },
    where: eq(Todo.userId, userId),
  });

  return todos;
};
