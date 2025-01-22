import { relations } from 'drizzle-orm';
import { index, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { Todo } from './todo';

export const User = pgTable(
  'user',
  {
    id: serial().primaryKey(),
    email: varchar({ length: 200 }).unique(),
  },
  t => ({
    emailIndex: index('email_idx').on(t.email),
  })
);

export const UserRel = relations(User, ({ many }) => ({
  todo: many(Todo),
}));
