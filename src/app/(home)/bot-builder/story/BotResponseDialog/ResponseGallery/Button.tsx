import { forwardRef, MouseEvent, useImperativeHandle, useRef, useState } from 'react';
import { Button, Form, FormItem, Input, Popover } from '@stylospectrum/ui';
import { ButtonDesign, IForm, IInput, IPopover, Placement } from '@stylospectrum/ui/dist/types';
import type { Identifier, XYCoord } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';

import styles from './button.module.scss';

import '@stylospectrum/ui/dist/icon/data/delete';
import '@stylospectrum/ui/dist/icon/data/sort';

interface GalleryButtonProps {
  onDelete: () => void;
  showSort: boolean;
  index: number;
  moveButton: (dragIndex: number, hoverIndex: number) => void;
  defaultValue: string;
}

interface DragItem {
  index: number;
}

export interface GalleryButtonRef {
  getValue: () => { [key: string]: string };
}

const GalleryButton = forwardRef<GalleryButtonRef, GalleryButtonProps>(
  ({ index, moveButton, onDelete, showSort, defaultValue }, ref) => {
    const [text, setText] = useState<string>(defaultValue);
    const [hover, setHover] = useState<boolean>(false);
    const buttonTextDomRef = useRef<IInput>(null);
    const popoverRef = useRef<IPopover>(null);
    const formRef = useRef<IForm>(null);
    const wrapperDomRef = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag, dragPreview] = useDrag(
      () => ({
        type: 'GALLERY_BUTTON',
        item: { index },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [index],
    );

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>(
      {
        accept: 'GALLERY_BUTTON',
        collect(monitor) {
          return {
            handlerId: monitor.getHandlerId(),
          };
        },
        hover(item: DragItem, monitor) {
          if (!wrapperDomRef.current) {
            return;
          }
          const dragIndex = item.index;
          const hoverIndex = index;

          if (dragIndex === hoverIndex) {
            return;
          }

          const hoverBoundingRect = wrapperDomRef.current.getBoundingClientRect();
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const clientOffset = monitor.getClientOffset();
          const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
          }

          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
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
      formRef.current?.setFieldsValue({ content: text });
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
          goTo: '',
        };
      },
    }));

    drop(dragPreview(wrapperDomRef));

    return (
      <div className={styles.wrapper}>
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

          {hover && (
            <div className={styles.actions}>
              {showSort && <Button icon="sort" ref={drag} />}
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
            <FormItem style={{ marginBottom: 0 }} label="Button text" name="content">
              <Input ref={buttonTextDomRef} style={{ width: '100%' }} />
            </FormItem>
          </Form>
        </Popover>
      </div>
    );
  },
);

GalleryButton.displayName = 'GalleryButton';

export default GalleryButton;
