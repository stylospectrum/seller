import { Icon } from '@stylospectrum/ui';

import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/home';
import '@stylospectrum/ui/dist/icon/data/response';
import '@stylospectrum/ui/dist/icon/data/fallback';
import '@stylospectrum/ui/dist/icon/data/post';

interface BlockProps {
  type: string;
  title: string;
}

export default function Block({ type, title }: BlockProps) {
  const data: { [key: string]: { [key1: string]: string } } = {
    START_POINT: {
      icon: 'home',
      text: 'Start point',
    },
    DEFAULT_FALLBACK: {
      icon: 'fallback',
      text: 'Default fallback',
    },
    BOT_RESPONSE: {
      icon: 'response',
      text: 'Bot response',
    },
    USER_INPUT: {
      icon: 'post',
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body} data-type={type}>
        <Icon name={data[type].icon} className={styles.icon} />

        {data[type].text && <div className={styles.text}>{data[type].text}</div>}
      </div>
    </div>
  );
}
