import { MouseEvent, useRef, useState } from 'react';
import { Button, Form, FormItem, Input, Popover } from '@stylospectrum/ui';
import { ButtonDesign, IForm, IInput, IPopover, Placement } from '@stylospectrum/ui/dist/types';
import type { Identifier, XYCoord } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';

import styles from './quick-reply.module.scss';

import '@stylospectrum/ui/dist/icon/data/delete';
import '@stylospectrum/ui/dist/icon/data/sort';

interface QuickReplyButtonProps {
  onDelete: () => void;
  showActions: boolean;
  index: number;
  moveButton: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
}

export default function QuickReplyButton({
  onDelete,
  showActions,
  index,
  moveButton,
}: QuickReplyButtonProps) {
  const [text, setText] = useState<string>('Button');
  const [hover, setHover] = useState<boolean>(false);
  const buttonTextDomRef = useRef<IInput>(null);
  const popoverRef = useRef<IPopover>(null);
  const formRef = useRef<IForm>(null);
  const wrapperDomRef = useRef<HTMLDivElement>(null);

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
      hover(item: DragItem, monitor) {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = wrapperDomRef.current!.getBoundingClientRect();
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

        const dragRight = dragIndex === hoverIndex - 1;
        const dragLeft = dragIndex === hoverIndex + 1;

        if (dragRight && dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
          return;
        }

        if (dragLeft && dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
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
    formRef.current?.setFieldsValue({ 'button-text': text });
  }

  function handleClose() {
    formRef.current?.resetFields();
    popoverRef.current?.hide();
  }

  function handleOk() {
    const values = formRef.current?.getFieldsValue();
    setText(values?.['button-text']);
    popoverRef.current?.hide();
  }

  function handleDelete(e: MouseEvent) {
    e.stopPropagation();
    onDelete();
  }

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
      <Popover ref={popoverRef} placement={Placement.Left}>
        <Button slot="ok-button" onClick={handleOk}>
          Ok
        </Button>
        <Button slot="cancel-button" type={ButtonDesign.Tertiary} onClick={handleClose}>
          Close
        </Button>

        <Form ref={formRef} style={{ padding: '1rem', width: '15.3125rem', display: 'block' }}>
          <FormItem style={{ marginBottom: 0 }} label="Button text" name="button-text">
            <Input ref={buttonTextDomRef} style={{ width: '100%' }} />
          </FormItem>
        </Form>
      </Popover>
    </div>
  );
}
