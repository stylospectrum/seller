import { Icon } from '@stylospectrum/ui';
import { useDrag } from 'react-dnd';

import styles from './index.module.scss';

interface ResponseBlockProps {
  id: string;
  icon: string;
  text: string;
}

export default function ResponseBlock({ icon, text, id }: ResponseBlockProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'BOX',
    item: { icon, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div className={styles.wrapper} ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className={styles['icon-wrapper']} ref={drag}>
        <Icon name={icon} className={styles.icon} />
      </div>

      <div className={styles.text}>{text}</div>
    </div>
  );
}
