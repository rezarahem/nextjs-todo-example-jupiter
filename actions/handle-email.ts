import { User } from '@/drizzle';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import 'server-only';

export const handleEmail = async (email: string) => {
  return await db.transaction(async tx => {
    const user = await tx.query.User.findFirst({
      where: eq(User.email, email),
    });

    if (user) {
      return user.id;
    }

    const [newUser] = await tx
      .insert(User)
      .values({
        email,
      })
      .returning();

    return newUser.id;
  });
};
