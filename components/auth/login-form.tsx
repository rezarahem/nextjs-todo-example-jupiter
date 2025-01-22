'use client';

import { userIdAtom } from '@/jotai/user-id-atom';
import { CheckEmail } from '@/server-actions/check-email';
import { Button, Input } from '@heroui/react';
import { useSetAtom } from 'jotai';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTransition } from 'react';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [userId, setUserId] = useState(0);
  const [key, setKey] = useState('');
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const setId = useSetAtom(userIdAtom);

  const submitEmail = () => {
    startTransition(async () => {
      const res = await CheckEmail(email);
      if (!res?.s) {
        toast.error(res?.m || 'Something went wrong');
      }
      if (res.s && res.userId && res.key) {
        setUserId(res.userId);
        setKey(res.key);
        setStep('otp');
        toast.success(res.m);
      }
    });
  };

  const submitOtp = () => {
    console.log(key);
    console.log(otp);

    if (key === otp) {
      setId(userId);
      toast.success('Login Successful!');
    } else {
      toast.error('Invalid OTP');
    }
  };

  return (
    <div>
      <div className='mx-auto flex max-w-lg flex-col gap-2'>
        <p className='font-bold'>Login with your email</p>
        {step === 'email' ? (
          <Input
            isDisabled={isPending}
            placeholder='Enter your email to login'
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
        ) : (
          <Input
            isDisabled={isPending}
            placeholder='Enter OTP'
            value={otp}
            onChange={e => {
              setOtp(e.target.value);
            }}
          />
        )}
        <Button
          size='lg'
          spinnerPlacement='end'
          isLoading={isPending}
          onPress={step === 'email' ? submitEmail : submitOtp}
          isDisabled={step === 'email' ? !email : !otp}
          className='font-bold self-start pr-2'>
          Login
          {!isPending && <ChevronRight />}
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
