'use server';

import { handleEmail } from '@/actions/handle-email';
import { sendOtp } from '@/actions/sent-otp';
import { emailSchema } from '@/zod';
const env = process.env.NODE_ENV;
export const CheckEmail = async (data: string) => {
 const email = emailSchema.safeParse(data);

 if (!email.success) {
  return { m: 'Invalid email', s: false };
 }

 const userId = await handleEmail(email.data);

 const key = env === 'development' ? 'ju' : await sendOtp(email.data);

 if (!key) {
  return {
   m: 'Something went wrong with sending OTP',
   s: false,
  };
 }

 return {
  userId,
  key,
  m: 'OTP was sent to your email',
  s: true,
 };
};
