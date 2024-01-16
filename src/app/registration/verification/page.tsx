'use client';

import { useRef, useState, type RefObject } from 'react';
import { Button, Form, FormItem, Input, MessageStrip, Toast } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import type { IForm, IToast } from '@stylospectrum/ui/dist/types';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import { authApi } from '@/api';
import { AuthWrapper } from '@/components';
import { useAuthStore, useUserStore } from '@/store';

export default function VerificationPage() {
  const formRef: RefObject<IForm> = useRef(null);
  const toastRef: RefObject<IToast> = useRef(null);
  const user = useUserStore((state) => state.user);
  const authStore = useAuthStore();
  const [infoVisible, setInfoVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFields();

    if (values) {
      try {
        const response = await authApi.signUp({
          name: user.name!,
          email: user.email,
          password: user.password!,
          otp: values.otp,
        });

        if (response.data.emailValid) {
          authStore.setAccessToken(response.data.accessToken);
          router.push('/');
        } else {
          toastRef.current?.show('Invalid OTP. Please check your code and try again');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleResend = async () => {
    const response = await authApi.sendOTPToEmail({
      email: user.email,
      isSignUp: true,
    });
    setInfoVisible(response.data.sent);
  };

  return (
    <>
      <AuthWrapper
        title="Verification required"
        buttonText="Create account"
        onButtonSubmit={handleSubmit}
        introTitle="Be a power seller"
        img={{
          height: 372.64,
          width: 400,
          src: '/images/registration.png',
        }}
        bottomNode={
          <Button onClick={handleResend} className={styles.button} type={ButtonDesign.Tertiary}>
            Resend OTP
          </Button>
        }
      >
        <div className={styles.description}>
          To verify your email, we have sent a One Time Password (OTP) to <b>{user.email}</b>.
        </div>
        <Form ref={formRef}>
          <FormItem
            label="Enter OTP"
            name="otp"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: 'Enter your otp' }]}
          >
            <Input style={{ width: '100%' }} allowClear className={styles.boxFormInput} />
          </FormItem>
        </Form>

        {infoVisible && (
          <MessageStrip style={{ marginTop: '1rem' }}>
            A new code has been sent to your email.
          </MessageStrip>
        )}
      </AuthWrapper>
      <Toast ref={toastRef} />
    </>
  );
}
