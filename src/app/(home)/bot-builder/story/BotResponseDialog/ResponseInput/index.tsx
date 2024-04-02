import {
  forwardRef,
  KeyboardEvent,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button, Textarea } from '@stylospectrum/ui';
import { ButtonDesign, Placement } from '@stylospectrum/ui/dist/types';

import styles from './index.module.scss';
import { SearchInPopover } from '@/components';
import { useBotVariables } from '@/hooks';
import { BotResponseText } from '@/model';
import {
  createCaret,
  findIndexOfCurrentWord,
  highlightText,
  replaceCurrentWord,
  replaceHighlightedText,
} from '@/utils/inputUtils';

import '@stylospectrum/ui/dist/icon/data/syntax';

interface ResponseInputProps {
  defaultValue?: BotResponseText;
}

export interface ResponseInputRef {
  getValue: () => BotResponseText;
}

const ResponseInput = forwardRef<ResponseInputRef, ResponseInputProps>(({ defaultValue }, ref) => {
  const [focused, setFocused] = useState(false);
  const [searchOpener, setSearchOpener] = useState<HTMLElement | null>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const selectedVar = useRef(false);
  const textareaRef: RefObject<any> = useRef(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const botVariablesQuery = useBotVariables();

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
    if (getCurrentWord(e.detail).startsWith('$')) {
      selectedVar.current = false;
      handleVarButtonClick();
    }
  }

  useImperativeHandle(ref, () => ({
    getValue: () => ({
      content: textareaRef.current?._innerValue || defaultValue?.content || '',
      id: defaultValue?.id,
    }),
  }));

  useEffect(() => {
    function checkClickOutside(e: MouseEvent) {
      setFocused(!!wrapRef.current?.contains(e.target as HTMLElement));
    }

    window.addEventListener('click', checkClickOutside);

    return () => {
      window.removeEventListener('click', checkClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles['textarea-wrap']} ref={wrapRef}>
        <div className={styles.mirror} ref={mirrorRef} />
        <Textarea
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onChange={handleChange}
          defaultValue={defaultValue?.content}
          ref={textareaRef}
          placeholder="Enter bot response"
        />

        <div className={styles['bottom-actions-wrap']}>
          <Button
            tabIndex={-1}
            icon="syntax"
            type={ButtonDesign.Secondary}
            onClick={handleVarButtonClick}
          />
        </div>
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
});

ResponseInput.displayName = 'ResponseInput';

export default ResponseInput;
