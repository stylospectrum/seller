import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Button, FormItem, Textarea } from '@stylospectrum/ui';
import {
  ButtonDesign,
  IButton,
  IForm,
  IFormItem,
  ITextarea,
  Placement,
} from '@stylospectrum/ui/dist/types';

import styles from './index.module.scss';
import { SearchInPopover } from '@/components';
import { useBotVariables } from '@/hooks';
import {
  createCaret,
  findIndexOfCurrentWord,
  highlightText,
  replaceCurrentWord,
  replaceHighlightedText,
} from '@/utils/inputUtils';

import '@stylospectrum/ui/dist/icon/data/syntax';

interface UserInputProps {
  id: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onDelete: (id: string) => void;
  showDeleteButton: boolean;
  getForm: () => IForm;
}

export default function UserInput({
  id,
  onBlur,
  onChange,
  showDeleteButton,
  onDelete,
  getForm,
}: UserInputProps) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchOpener, setSearchOpener] = useState<HTMLElement | null>(null);
  const formItemRef = useRef<IFormItem>(null);
  const textareaRef = useRef<ITextarea>(null);
  const topActionRef = useRef<IButton>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const selectedVar = useRef(false);
  const botVariablesQuery = useBotVariables();

  function setFormValue() {
    getForm().setFieldsValue({ [id]: textareaRef.current!.getFocusDomRef().value });
  }

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  function handleVarButtonClick() {
    createCaret(textareaRef.current!.getFocusDomRef(), (pre, caretEle, post) => {
      mirrorRef.current!.innerHTML = '';
      mirrorRef.current!.append(pre, caretEle, post);
      setSearchOpener(caretEle);
    });
  }

  function handleOptionClick(option: any) {
    const textareaNode = textareaRef.current!.getFocusDomRef();

    requestAnimationFrame(() => {
      if (selectedVar.current) {
        replaceHighlightedText(`$${option.name}`, textareaNode);
        selectedVar.current = false;
      } else {
        replaceCurrentWord(`$${option.name}`, textareaNode);
      }

      setFormValue();
      setFocused(true);
    });
  }

  function handleClick() {
    highlightText(textareaRef.current!.getFocusDomRef(), () => {
      selectedVar.current = true;
    });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      const currentWord = getCurrentWord(textareaRef.current!.getFocusDomRef()!.value);

      if (currentWord.startsWith('$')) {
        e.preventDefault();
        replaceCurrentWord('', textareaRef.current!.getFocusDomRef()!);
        setFormValue();
      }
    }
  }

  function getCurrentWord(value: string) {
    const textareaNode = textareaRef.current!.getFocusDomRef();
    const cursorPos = textareaNode!.selectionStart;
    const startIndex = findIndexOfCurrentWord(textareaNode!);
    return value.substring(startIndex + 1, cursorPos);
  }

  function handleChange(e: any) {
    onChange(e.detail);

    if (getCurrentWord(e.detail).startsWith('$')) {
      selectedVar.current = false;
      handleVarButtonClick();
    }
  }

  useEffect(() => {
    if (hover) {
      const { top, left } = textareaRef.current!.getBoundingClientRect();

      if (topActionRef.current) {
        topActionRef.current.style.top = `${top}px`;
        topActionRef.current.style.left = `${left - 40}px`;
      }
    }
  }, [hover]);

  useEffect(() => {
    function checkClickOutside(e: MouseEvent) {
      setFocused(!!formItemRef.current?.contains(e.target as HTMLElement));
    }

    window.addEventListener('click', checkClickOutside);

    return () => {
      window.removeEventListener('click', checkClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={styles['textarea-wrap']}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.mirror} ref={mirrorRef} />
        <FormItem ref={formItemRef} name={id} style={{ position: 'relative', padding: '0 1rem' }}>
          <Textarea
            ref={textareaRef}
            placeholder="Enter user message"
            style={{ width: '100%' }}
            onClick={handleClick}
            onBlur={onBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormItem>
        {hover && showDeleteButton && (
          <Button
            ref={topActionRef}
            icon="delete"
            className={styles['delete-button']}
            onClick={() => onDelete(id)}
          />
        )}

        {focused && (
          <div className={styles['bottom-actions-wrap']}>
            <Button
              tabIndex={-1}
              icon="syntax"
              type={ButtonDesign.Secondary}
              onClick={handleVarButtonClick}
            />
          </div>
        )}
      </div>

      {!botVariablesQuery.isLoading && (
        <SearchInPopover
          onItemClick={handleOptionClick}
          placement={Placement.Bottom}
          offsetY={8}
          offsetX={0}
          opener={searchOpener}
          options={(botVariablesQuery.data || []).filter(
            (opt) => !opt.isSystem && !opt.entity?.name,
          )}
        />
      )}
    </>
  );
}
