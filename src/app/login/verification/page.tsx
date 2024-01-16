'use client';

import { useRef, useState, type RefObject } from 'react';
import { Button, Form, FormItem, Input, MessageStrip, Toast } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import type { IForm, IToast } from '@stylospectrum/ui/dist/types';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import { authApi } from '@/api';
import { AuthWrapper } from '@/components';
import { useUserStore } from '@/store';

export default function VerificationPage() {
  const formRef: RefObject<IForm> = useRef(null);
  const toastRef: RefObject<IToast> = useRef(null);
  const user = useUserStore((state) => state.user);
  const [infoVisible, setInfoVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFields();

    if (values) {
      try {
        const response = await authApi.verifyOTP({
          email: user.email,
          otp: values.otp,
        });

        if (response.data.valid) {
          router.push('/login/new-password');
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
    });
    setInfoVisible(response.data.sent);
  };

  return (
    <>
      <AuthWrapper
        title="Verification required"
        buttonText="Continue"
        onButtonSubmit={handleSubmit}
        bottomNode={
          <Button onClick={handleResend} className={styles.button} type={ButtonDesign.Tertiary}>
            Resend OTP
          </Button>
        }
      >
        <div className={styles.description}>
          To continue, complete this verification step. We have sent OTP to the email {user.email}.
          Please enter it below.
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
