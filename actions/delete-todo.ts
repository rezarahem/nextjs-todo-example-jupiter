import { Todo } from '@/drizzle';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import 'server-only';

export const deleteTodo = async (id: number) => {
  await db.delete(Todo).where(eq(Todo.id, id));

  return true;
};
