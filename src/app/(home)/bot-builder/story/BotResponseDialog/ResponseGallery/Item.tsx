import { forwardRef, RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Form, FormItem, Input, Textarea } from '@stylospectrum/ui';
import { ButtonDesign, IForm } from '@stylospectrum/ui/dist/types';
import type { Identifier } from 'dnd-core';
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';

import ResponseImage, { ResponseImageRef } from '../ResponseImage';
import GalleryButton, { GalleryButtonRef } from './Button';
import styles from './item.module.scss';
import { BotResponseButton, BotResponseGalleryItem } from '@/model/bot-response';

import '@stylospectrum/ui/dist/icon/data/add';

interface GalleryItemProps {
  onDelete: () => void;
  showActions: boolean;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  defaultValue: BotResponseGalleryItem;
  onButtonClick: (callback: Function) => void;
}

interface DragItem {
  index: number;
}

export interface GalleryItemRef {
  getValue: () => Promise<BotResponseGalleryItem>;
}

const GalleryItem = forwardRef<GalleryItemRef, GalleryItemProps>(
  ({ index, moveItem, onDelete, showActions, defaultValue, onButtonClick }, ref) => {
    const [buttons, setButtons] = useState<BotResponseButton[]>(
      defaultValue.buttons?.length
        ? defaultValue.buttons
        : [
            {
              id: 'client-' + uuidv4(),
              content: 'Button',
            },
          ],
    );
    const [hover, setHover] = useState(false);
    const wrapperDomRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<{ [key: string]: GalleryButtonRef }>({});
    const imageRef = useRef<ResponseImageRef>(null);
    const formRef: RefObject<IForm> = useRef(null);

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

    function handleAddButton() {
      setButtons((prev) => [...prev, { id: 'client-' + uuidv4(), content: 'Button' }]);
    }

    function handleDeleteButton(index: number) {
      if (buttons[index].id?.startsWith('client-')) {
        setButtons((prev) => {
          const newButtons = [...prev];
          newButtons.splice(index, 1);
          return newButtons;
        });
      } else {
        const cloned: BotResponseButton[] = JSON.parse(JSON.stringify(buttons));
        cloned[index].deleted = true;
        setButtons(cloned);
      }
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

    useImperativeHandle(ref, () => ({
      getValue: async () => {
        const formValue = formRef.current!.getFieldsValue();
        return {
          ...formValue,
          imageId: await imageRef.current?.uploadImage?.(),
          buttons: buttons.map((button) => {
            const value = buttonsRef.current[button.id!]?.getValue?.();

            return {
              id: button.id?.startsWith('client-') ? undefined : button.id,
              deleted: button.deleted,
              content: value?.content || '',
              goTo: value?.goTo || '',
            };
          }),
        };
      },
    }));

    useEffect(() => {
      if (defaultValue.title || defaultValue.description) {
        setTimeout(() => {
          formRef.current?.setFieldsValue?.({
            title: defaultValue.title,
            description: defaultValue.description,
          });
        });
      }
    }, [defaultValue]);

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
          <ResponseImage
            ref={imageRef}
            src={defaultValue.imageUrl}
            className={styles.image}
            width={240}
            height={145}
            iconSize={2}
          />
          <Form ref={formRef} className={styles.form}>
            <FormItem name="title" style={{ marginBottom: '-0.375rem' }}>
              <Input placeholder="Enter title" className={styles.input} />
            </FormItem>

            <FormItem name="description" style={{ marginBottom: 0 }}>
              <Textarea placeholder="Enter description" className={styles.input} />
            </FormItem>
          </Form>

          {buttons.length > 0 && (
            <div className={styles.buttons}>
              {buttons.map((button, index) => {
                if (button.deleted) {
                  return null;
                }

                return (
                  <GalleryButton
                    ref={(el) => (buttonsRef.current[button.id!] = el!)}
                    index={index}
                    showSort={buttons.length > 1}
                    key={button.id}
                    onDelete={() => handleDeleteButton(index)}
                    moveButton={handleMoveButton}
                    defaultValue={button}
                    onClick={onButtonClick}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className={styles['add-button']}>
          <div className={styles['add-button-line']} />
          <Button icon="add" onClick={handleAddButton} circle type={ButtonDesign.Secondary} />
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
  },
);

GalleryItem.displayName = 'GalleryItem';

export default GalleryItem;
