import { forwardRef, MouseEvent, useImperativeHandle, useRef, useState } from 'react';
import { Button, Form, FormItem, Input, Popover, Select } from '@stylospectrum/ui';
import { ButtonDesign, IForm, IInput, IPopover, Placement } from '@stylospectrum/ui/dist/types';
import type { Identifier } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';

import styles from './button.module.scss';
import { useBotUserInputBlocks } from '@/hooks';
import { BotResponseButton } from '@/model';

import '@stylospectrum/ui/dist/icon/data/delete';
import '@stylospectrum/ui/dist/icon/data/sort';

export interface QuickReplyButtonRef {
  getValue: () => { [key: string]: string };
}

interface QuickReplyButtonProps {
  onDelete: () => void;
  showActions: boolean;
  index: number;
  moveButton: (dragIndex: number, hoverIndex: number) => void;
  defaultValue: BotResponseButton;
}

interface DragItem {
  index: number;
}

const QuickReplyButton = forwardRef<QuickReplyButtonRef, QuickReplyButtonProps>(
  ({ onDelete, showActions, index, moveButton, defaultValue }, ref) => {
    const [text, setText] = useState<string>(defaultValue.content);
    const [hover, setHover] = useState<boolean>(false);
    const buttonTextDomRef = useRef<IInput>(null);
    const popoverRef = useRef<IPopover>(null);
    const formRef = useRef<IForm>(null);
    const wrapperDomRef = useRef<HTMLDivElement>(null);
    const userInputBlocksQuery = useBotUserInputBlocks();

    const [{ isDragging }, drag, dragPreview] = useDrag(
      () => ({
        type: 'REPLY_BUTTON',
        item: { index },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [index],
    );

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>(
      {
        accept: 'REPLY_BUTTON',
        collect(monitor) {
          return {
            handlerId: monitor.getHandlerId(),
          };
        },
        hover(item: DragItem) {
          const dragIndex = item.index;
          const hoverIndex = index;

          if (dragIndex === hoverIndex) {
            return;
          }

          moveButton(dragIndex, hoverIndex);

          item.index = hoverIndex;
        },
      },
      [index],
    );

    function handleMouseEnter() {
      if (popoverRef.current?.opened) {
        return;
      }

      setHover(true);
    }

    function handleMouseLeave() {
      setHover(false);
    }

    function handleClick() {
      setHover(false);
      popoverRef.current?.showAt(wrapperDomRef.current!);
      buttonTextDomRef.current?.input.focus();
      formRef.current?.setFieldsValue({
        content: text,
        ['go-to']: formRef.current?.getFieldsValue()['go-to'] || defaultValue.goTo,
      });
    }

    function handleClose() {
      formRef.current?.resetFields();
      popoverRef.current?.hide();
    }

    function handleOk() {
      const values = formRef.current?.getFieldsValue();
      setText(values?.['content'] as string);
      popoverRef.current?.hide();
    }

    function handleDelete(e: MouseEvent) {
      e.stopPropagation();
      onDelete();
    }

    useImperativeHandle(ref, () => ({
      getValue() {
        return {
          content: text,
          goTo: (formRef.current?.getFieldsValue()['go-to'] as string) || '',
        };
      },
    }));

    drop(dragPreview(wrapperDomRef));

    return (
      <div>
        <div
          className={styles['button-wrapper']}
          style={{ opacity: isDragging ? 0 : 1 }}
          data-handler-id={handlerId}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          ref={wrapperDomRef}
        >
          <button className={styles.button}>
            <span className={styles['button-text']}>{text}</span>
          </button>

          {hover && showActions && (
            <div className={styles.actions}>
              <Button icon="sort" ref={drag} iconRotate={90} />
              <Button icon="delete" onClick={handleDelete} />
            </div>
          )}
        </div>
        <Popover ref={popoverRef} placement={Placement.Left} style={{ display: 'none' }}>
          <Button slot="ok-button" onClick={handleOk}>
            Ok
          </Button>
          <Button slot="cancel-button" type={ButtonDesign.Tertiary} onClick={handleClose}>
            Close
          </Button>

          <Form ref={formRef} style={{ padding: '1rem', width: '15.3125rem', display: 'block' }}>
            <FormItem label="Button text" name="content">
              <Input ref={buttonTextDomRef} style={{ width: '100%' }} />
            </FormItem>

            <FormItem style={{ marginBottom: 0 }} label="Go to" name="go-to">
              <Select
                options={(userInputBlocksQuery.data || []).map((opt) => ({
                  id: opt.id!,
                  name: opt.name!,
                }))}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Form>
        </Popover>
      </div>
    );
  },
);

QuickReplyButton.displayName = 'QuickReplyButton';

export default QuickReplyButton;
