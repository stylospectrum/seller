import { Icon } from '@stylospectrum/ui';
import { useDrag } from 'react-dnd';

import styles from './index.module.scss';
import { BotResponseType } from '@/enums';

interface ResponseBlockProps {
  type: BotResponseType;
  icon: string;
  text: string;
}

export default function ResponseBlock({ icon, text, type }: ResponseBlockProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'BOX',
    item: { icon, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      className={styles.wrapper}
      id={type}
      ref={dragPreview}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={styles['icon-wrapper']} ref={drag}>
        <Icon name={icon} className={styles.icon} />
      </div>

      <div className={styles.text}>{text}</div>
    </div>
  );
}
