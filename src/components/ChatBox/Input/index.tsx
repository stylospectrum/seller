import { ChangeEvent, CSSProperties, FC, KeyboardEvent, useRef, useState } from 'react';
import { isEnter } from '@stylospectrum/ui/dist/utils/Keys';

import styles from './index.module.scss';
import calculateTextareaHeight from '@/utils/calculateTextareaHeight';

interface ChatBoxInputProps {
  onEnter: (value: string) => void;
}

const ChatBoxInput: FC<ChatBoxInputProps> = ({ onEnter }) => {
  const node = useRef<HTMLTextAreaElement>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  const handleInput = (e: ChangeEvent) => {
    const node = e.target as HTMLTextAreaElement;
    setStyle(calculateTextareaHeight(node));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isEnter(e as any)) {
      e.preventDefault();
      onEnter((e.target as HTMLTextAreaElement).value);
      node.current!.value = '';
    }
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        ref={node}
        style={style}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      ></textarea>
    </div>
  );
};

export default ChatBoxInput;
