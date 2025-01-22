import { Todo } from '@/drizzle';
import { db } from '@/drizzle/db';
import 'server-only';

export const createTodo = async (id: number, todo: string) => {
  const [res] = await db
    .insert(Todo)
    .values({
      body: todo,
      userId: id,
    })
    .returning();

  return {
    body: res.body,
    id: res.id,
  };
};
