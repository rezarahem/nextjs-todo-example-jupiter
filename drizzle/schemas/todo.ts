import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { User } from './user';

export const Todo = pgTable('todo', {
  id: serial('id').primaryKey(),
  body: text().notNull(),
  userId: integer('user_id').notNull(),
});

export const TodoRel = relations(Todo, ({ one }) => ({
  user: one(User, {
    fields: [Todo.userId],
    references: [User.id],
  }),
}));
