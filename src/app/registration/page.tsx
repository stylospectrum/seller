'use client';

import { useRef, type RefObject } from 'react';
import { Form, FormItem, Input, Link, Toast } from '@stylospectrum/ui';
import { InputType } from '@stylospectrum/ui/dist/enums';
import type { IForm, IToast } from '@stylospectrum/ui/dist/types';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import { authApi } from '@/api';
import { AuthWrapper } from '@/components';
import { User } from '@/model';
import { useUserStore } from '@/store';

export default function LoginPage() {
  const formRef: RefObject<IForm> = useRef(null);
  const toastRef: RefObject<IToast> = useRef(null);
  const userStore = useUserStore();
  const router = useRouter();

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFields();

    if (values) {
      try {
        const response = await authApi.sendOTPToEmail({
          email: values.email,
          isSignUp: true,
        });

        if (response.statusCode !== 200) {
          toastRef.current?.show(response.message);
          return;
        }

        if (response.data.sent) {
          userStore.setUser(
            new User({
              name: values.name,
              email: values.email,
              password: values.password,
            }),
          );
          router.push('/registration/verification');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <AuthWrapper
        title="Create account"
        buttonText="Verify email"
        onButtonSubmit={handleSubmit}
        introTitle="Be a power seller"
        img={{
          height: 372.64,
          width: 400,
          src: '/images/registration.png',
        }}
        bottomNode={
          <div className={styles.boxText}>
            <span>Already have an account?</span>
            <Link onClick={() => router.push('/login')}>Sign in!</Link>
          </div>
        }
      >
        <Form ref={formRef}>
          <FormItem
            label="Shop name"
            name="name"
            rules={[{ required: true, message: 'Enter your name' }]}
          >
            <Input allowClear className={styles.boxFormInput} />
          </FormItem>

          <FormItem
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Enter your email' },
              {
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: 'Wrong or Invalid email address. Please correct and try again',
              },
            ]}
          >
            <Input allowClear className={styles.boxFormInput} />
          </FormItem>

          <FormItem
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Enter your password' }]}
          >
            <Input type={InputType.Password} allowClear className={styles.boxFormInput} />
          </FormItem>
        </Form>
      </AuthWrapper>
      <Toast ref={toastRef} />
    </>
  );
}
