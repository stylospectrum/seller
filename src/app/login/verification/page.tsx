'use client';

import { useRef, useState, type RefObject } from 'react';
import { Button, Form, FormItem, Input, MessageStrip, Toast } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/enums';
import type { IForm, IToast } from '@stylospectrum/ui/dist/types';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import { LoginWrapper } from '@/components';
import { usePasswordAssistanceStore } from '@/store';

export default function VerificationPage() {
  const formRef: RefObject<IForm> = useRef(null);
  const toastRef: RefObject<IToast> = useRef(null);
  const email = usePasswordAssistanceStore((state) => state.email);
  const [infoVisible, setInfoVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFields();

    if (values) {
      const res = await fetch(`/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: values.otp,
        }),
      });
      const data = await res.json();

      if (data.valid) {
        router.push('/login/new-password');
      } else {
        toastRef.current?.show('Invalid OTP. Please check your code and try again');
      }
    }
  };

  const handleResend = async () => {
    const res = await fetch(`/api/send-otp-to-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        role: 'Seller',
      }),
    });
    const data = await res.json();
    setInfoVisible(data.sent);
  };

  return (
    <>
      <LoginWrapper
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
          To continue, complete this verification step. We have sent OTP to the email {email}.
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
      </LoginWrapper>
      <Toast ref={toastRef} />
    </>
  );
}
