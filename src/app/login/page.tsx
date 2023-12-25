'use client';

import { useRef, type KeyboardEvent, type RefObject } from 'react';
import { Checkbox, Form, FormItem, Input, Link, Toast } from '@stylospectrum/ui';
import { InputType } from '@stylospectrum/ui/dist/enums';
import type { IButton, IForm, IInput, ILink, IToast } from '@stylospectrum/ui/dist/types';
import { isTabNext } from '@stylospectrum/ui/dist/utils/Keys';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';
import { LoginWrapper } from '@/components';

export default function LoginPage() {
  const formRef: RefObject<IForm> = useRef(null);
  const passRef: RefObject<IInput> = useRef(null);
  const forgotPassRef: RefObject<ILink> = useRef(null);
  const createAnAccRef: RefObject<ILink> = useRef(null);
  const toastRef: RefObject<IToast> = useRef(null);
  const router = useRouter();

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFields();

    if (values) {
      const res = await fetch(`/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();

      if (data.statusCode === 401) {
        toastRef.current?.show(data.message);
      }
    }
  };

  const handleEmailKeyDown = (e: KeyboardEvent<IInput>) => {
    if (isTabNext(e as any)) {
      requestAnimationFrame(() => {
        passRef.current?.shadowRoot?.querySelector('input')?.focus();
      });
    }
  };

  const handleForgotPassKeyDown = (e: KeyboardEvent<ILink>) => {
    if (isTabNext(e as any)) {
      requestAnimationFrame(() => {
        createAnAccRef.current?.shadowRoot?.querySelector('a')?.focus();
      });
    }
  };

  const handleButtonKeyDown = (e: KeyboardEvent<IButton>) => {
    if (isTabNext(e as any)) {
      requestAnimationFrame(() => {
        forgotPassRef.current?.shadowRoot?.querySelector('a')?.focus();
      });
    }
  };

  return (
    <>
      <LoginWrapper
        title="Sign in"
        buttonText="Sign In"
        onButtonKeyDown={handleButtonKeyDown}
        onButtonSubmit={handleSubmit}
        bottomNode={
          <div className={styles.boxText}>
            <span>Do you not have an account?</span>
            <Link ref={createAnAccRef} slot="suffix-label">
              Create an account!
            </Link>
          </div>
        }
      >
        <Form ref={formRef}>
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
            <Input onKeyDown={handleEmailKeyDown} allowClear className={styles.boxFormInput} />
          </FormItem>

          <FormItem
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Enter your password' }]}
          >
            <Link
              onClick={() => router.push('/login/password-assistance')}
              onKeyDown={handleForgotPassKeyDown}
              ref={forgotPassRef}
              slot="suffix-label"
            >
              Forgot your password?
            </Link>
            <Input
              ref={passRef}
              type={InputType.Password}
              allowClear
              className={styles.boxFormInput}
            />
          </FormItem>

          <FormItem name="keep-me-signed-in" style={{ marginBottom: 0 }}>
            <Checkbox text="Keep me signed in" style={{ marginLeft: '-0.25rem' }} />
          </FormItem>
        </Form>
      </LoginWrapper>
      <Toast ref={toastRef} />
    </>
  );
}
