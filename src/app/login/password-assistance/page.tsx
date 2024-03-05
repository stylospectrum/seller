'use client';

import { useRef, type RefObject } from 'react';
import { Form, FormItem, Input, Toast } from '@stylospectrum/ui';
import type { IForm, IToast } from '@stylospectrum/ui/dist/types';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import { authApi } from '@/api';
import { AuthWrapper } from '@/components';
import { User } from '@/model';
import { useUserStore } from '@/store';

export default function PasswordAssistancePage() {
  const formRef: RefObject<IForm> = useRef(null);
  const toastRef: RefObject<IToast> = useRef(null);
  const router = useRouter();
  const userStore = useUserStore();

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFields();

    if (values) {
      try {
        const response = await authApi.sendOTPToEmail({
          email: values.email as string,
        });

        if (response.statusCode !== 200) {
          toastRef.current?.show(response.message);
          return;
        }

        if (response.data.sent) {
          userStore.setUser(new User({ email: values.email as string }));
          router.push('/login/verification');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <AuthWrapper title="Password assistance" buttonText="Continue" onButtonSubmit={handleSubmit}>
        <div className={styles.description}>
          Enter the email address associated with your account.
        </div>
        <Form ref={formRef}>
          <FormItem
            label="Email"
            name="email"
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: 'Enter your email' },
              {
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: 'Wrong or Invalid email address. Please correct and try again',
              },
            ]}
          >
            <Input style={{ width: '100%' }} allowClear className={styles.boxFormInput} />
          </FormItem>
        </Form>
      </AuthWrapper>
      <Toast ref={toastRef} />
    </>
  );
}
