'use client';

import { useRef, type RefObject } from 'react';
import { Form, FormItem, Input, Toast } from '@stylospectrum/ui';
import { InputType } from '@stylospectrum/ui/dist/types';
import type { IForm, IToast } from '@stylospectrum/ui/dist/types';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import { authApi } from '@/api';
import { AuthWrapper } from '@/components';
import { useAuthStore, useUserStore } from '@/store';

export default function PasswordAssistancePage() {
  const formRef: RefObject<IForm> = useRef(null);
  const router = useRouter();
  const toastRef: RefObject<IToast> = useRef(null);
  const user = useUserStore((state) => state.user);
  const authStore = useAuthStore();

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFields();

    if (values) {
      try {
        const response = await authApi.updatePassword({
          password: values.password as string,
          email: user.email,
        });

        if (response.statusCode !== 200) {
          toastRef.current?.show(response.message);
          return;
        }

        authStore.setAccessToken(response.data.accessToken);
        router.push('/');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <AuthWrapper
        title="Create new password"
        buttonText="Save changes and Sign-In"
        onButtonSubmit={handleSubmit}
      >
        <div className={styles.description}>
          We will ask for this password whenever you Sign-In.
        </div>
        <Form ref={formRef}>
          <FormItem
            label="New password"
            name="password"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: 'Enter new password' }]}
          >
            <Input
              style={{ width: '100%' }}
              type={InputType.Password}
              allowClear
              className={styles.boxFormInput}
            />
          </FormItem>
        </Form>
      </AuthWrapper>
      <Toast ref={toastRef} />
    </>
  );
}
