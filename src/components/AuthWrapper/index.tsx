import type { FC, KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import { Button } from '@stylospectrum/ui';
import Image from 'next/image';

import styles from './index.module.scss';

interface AuthWrapper {
  children: ReactNode;
  title: string;
  bottomNode?: ReactNode;
  buttonText: string;
  onButtonSubmit?: MouseEventHandler;
  onButtonKeyDown?: KeyboardEventHandler;
  introTitle?: string;
  img?: {
    src: string;
    width: number;
    height: number;
  };
}

const AuthWrapper: FC<AuthWrapper> = ({
  children,
  title,
  bottomNode,
  buttonText,
  onButtonKeyDown,
  onButtonSubmit,
  introTitle = 'Grow your business and Sell more',
  img = {
    height: 248.75,
    width: 400,
    src: '/images/login.png',
  },
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.intro}>
          <div className={styles.introText}>{introTitle}</div>
          <div className={styles.introImage}>
            <Image {...img} alt="Illustration" />
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

export default AuthWrapper;
