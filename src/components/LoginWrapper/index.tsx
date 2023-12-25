import type { FC, KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import { Button } from '@stylospectrum/ui';
import Image from 'next/image';

import styles from './index.module.scss';

interface LoginWrapper {
  children: ReactNode;
  title: string;
  bottomNode?: ReactNode;
  buttonText: string;
  onButtonSubmit?: MouseEventHandler;
  onButtonKeyDown?: KeyboardEventHandler;
}

const LoginWrapper: FC<LoginWrapper> = ({
  children,
  title,
  bottomNode,
  buttonText,
  onButtonKeyDown,
  onButtonSubmit,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.intro}>
          <div className={styles.introText}>Explore, try on, and buy your favorite clothes!</div>
          <div className={styles.introImage}>
            <Image
              src="/images/illustration-login.svg"
              height={400}
              width={398.55}
              alt="Illustration Login"
            />
          </div>
        </div>

        <div className={styles.box}>
          <div className={styles.boxForm}>
            <div className={styles.boxFormTitle}>{title}</div>
            {children}
          </div>

          <Button onKeyDown={onButtonKeyDown} className={styles.boxButton} onClick={onButtonSubmit}>
            {buttonText}
          </Button>

          {bottomNode}
        </div>
      </div>
    </div>
  );
};

export default LoginWrapper;
