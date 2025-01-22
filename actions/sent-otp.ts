import 'server-only';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'todo-app-mail',
  port: 25,
  secure: false,
  auth: {
    user: 'user',
    pass: 'pass',
  },
});

const genOtp = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const otpLength = 5;
  let otp = '';

  for (let i = 0; i < otpLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};

export const sendOtp = async (to: string) => {
  const otp = genOtp();
  const from = process.env.SMTP_EMAIL as string;

  try {
    const mail = {
      from,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}`,
      html: `
      <p>Your OTP is <b>${otp}</p>
      <button onclick="navigator.clipboard.writeText('${otp}')">Copy OTP</button>
    `,
    };

    await transporter.sendMail(mail);

    return otp;
  } catch (error) {
    return '';
  }
};
