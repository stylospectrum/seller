import { useRef, useState } from 'react';
import { Button, Form, FormItem, Input, Textarea } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import type { Identifier } from 'dnd-core';
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';

import ResponseImage from '../ResponseImage';
import GalleryButton from './Button';
import styles from './item.module.scss';

import '@stylospectrum/ui/dist/icon/data/add';

interface GalleryItemProps {
  onDelete: () => void;
  showActions: boolean;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onDrop: (index: number) => void;
}

interface DragItem {
  index: number;
}

export default function GalleryItem({
  index,
  moveItem,
  onDelete,
  showActions,
  onDrop,
}: GalleryItemProps) {
  const [buttons, setButtons] = useState<string[]>([uuidv4()]);
  const [hover, setHover] = useState(false);
  const wrapperDomRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'GALLERY_ITEM',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index],
  );

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>(
    {
      accept: 'GALLERY_ITEM',
      drop(item) {
        onDrop(item.index);
      },
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

        moveItem(dragIndex, hoverIndex);

        item.index = hoverIndex;
      },
    },
    [index],
  );

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  function handleAdd() {
    setButtons([...buttons, uuidv4()]);
  }

  function handleDeleteButton(id: string) {
    setButtons(buttons.filter((button) => button !== id));
  }

  function handleMoveButton(dragIdx: number, hoverIdx: number) {
    setButtons((prev) => {
      return update(prev, {
        $splice: [
          [dragIdx, 1],
          [hoverIdx, 0, prev[dragIdx]],
        ],
      });
    });
  }

  drop(dragPreview(wrapperDomRef));

  return (
    <div
      ref={wrapperDomRef}
      className={styles.wrapper}
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.card}>
        <ResponseImage className={styles.image} width={240} height={145} iconSize={2} />
        <Form className={styles.form}>
          <FormItem name="title" style={{ marginBottom: '-0.375rem' }}>
            <Input placeholder="Enter title" className={styles.input} />
          </FormItem>

          <FormItem name="description" style={{ marginBottom: 0 }}>
            <Textarea placeholder="Enter description" className={styles.input} />
          </FormItem>
        </Form>

        {buttons.length > 0 && (
          <div className={styles.buttons}>
            {buttons.map((button, index) => (
              <GalleryButton
                index={index}
                showSort={buttons.length > 1}
                key={button}
                onDelete={() => handleDeleteButton(button)}
                moveButton={handleMoveButton}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles['add-button']}>
        <div className={styles['add-button-line']} />
        <Button icon="add" onClick={handleAdd} circle type={ButtonDesign.Secondary} />
        <div className={styles['add-button-text']}>Add button</div>
      </div>

      {hover && showActions && (
        <div className={styles.actions}>
          <Button icon="sort" ref={drag} iconRotate={90} />
          <Button icon="delete" onClick={onDelete} />
        </div>
      )}
    </div>
  );
}
