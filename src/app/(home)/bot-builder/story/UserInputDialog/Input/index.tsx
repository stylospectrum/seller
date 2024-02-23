import { useEffect, useRef, useState } from 'react';
import { Button, FormItem, Textarea } from '@stylospectrum/ui';
import { IButton } from '@stylospectrum/ui/dist/types';

import styles from './index.module.scss';

interface UserInputProps {
  id: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onDelete: (id: string) => void;
  showDeleteButton: boolean;
}

export default function UserInput({
  id,
  onBlur,
  onChange,
  showDeleteButton,
  onDelete,
}: UserInputProps) {
  const [hover, setHover] = useState(false);
  const textareaRef = useRef<any>(null);
  const buttonRef = useRef<IButton>(null);

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  useEffect(() => {
    if (hover) {
      const { top, left } = textareaRef.current.getBoundingClientRect();
      const actionsDom = buttonRef.current;

      if (actionsDom) {
        actionsDom.style.top = `${top}px`;
        actionsDom.style.left = `${left - 40}px`;
      }
    }
  }, [hover]);

  return (
    <FormItem
      name={id}
      style={{ position: 'relative', padding: '0 1rem' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Textarea
        ref={textareaRef}
        placeholder="Enter user message"
        style={{ width: '100%' }}
        onBlur={onBlur}
        onChange={(e: any) => onChange(e.detail)}
      />

      {hover && showDeleteButton && (
        <Button
          ref={buttonRef}
          icon="delete"
          className={styles['delete-button']}
          onClick={() => onDelete(id)}
        />
      )}
    </FormItem>
  );
}
