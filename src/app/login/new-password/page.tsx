'use client';

import { useRef, type RefObject } from 'react';
import { Form, FormItem, Input } from '@stylospectrum/ui';
import { InputType } from '@stylospectrum/ui/dist/enums';
import type { IForm } from '@stylospectrum/ui/dist/types';

import styles from './page.module.scss';
import { AuthWrapper } from '@/components';
import { useEmailStore } from '@/store';

export default function PasswordAssistancePage() {
  const formRef: RefObject<IForm> = useRef(null);
  const email = useEmailStore((state) => state.email);

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFields();

    if (values) {
      const res = await fetch(`/api/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: values.password,
          role: 'Seller',
        }),
      });
      const data = await res.json();
      console.log(data);
    }
  };

  return (
    <AuthWrapper
      title="Create new password"
      buttonText="Save changes and Sign-In"
      onButtonSubmit={handleSubmit}
    >
      <div className={styles.description}>We will ask for this password whenever you Sign-In.</div>
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
  );
}
