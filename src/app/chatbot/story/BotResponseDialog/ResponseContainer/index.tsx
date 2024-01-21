import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import type { Identifier, XYCoord } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';

import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/delete';
import '@stylospectrum/ui/dist/icon/data/sort';

interface ResponseContainerProps {
  id: string;
  index: number;
  children: React.ReactNode;
  onDelete: () => void;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  isGallery: boolean;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export default function ResponseContainer({
  children,
  onDelete,
  id,
  index,
  moveItem,
  isGallery,
}: ResponseContainerProps) {
  const [hover, setHover] = useState(false);
  const containerDomRef = useRef<HTMLDivElement>(null);
  const actionsDomRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'ITEM',
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index],
  );

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>(
    {
      accept: 'ITEM',
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      hover(item: DragItem, monitor) {
        if (!containerDomRef.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = containerDomRef.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
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

  useEffect(() => {
    if (hover && containerDomRef.current && !isDragging) {
      const { top, left } = containerDomRef.current.getBoundingClientRect();
      const actionsDom = actionsDomRef.current;
      const extraTop = isGallery ? 16 : 0;

      if (actionsDom) {
        actionsDom.style.top = `${top + extraTop}px`;
        actionsDom.style.left = `${left - 24}px`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover, isDragging]);

  drop(dragPreview(containerDomRef));

  return (
    <div
      ref={containerDomRef}
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-handler-id={handlerId}
      style={{
        opacity: isDragging ? 0 : 1,
        marginTop: isGallery ? '-1rem' : 0,
        marginLeft: isGallery ? '-0.125rem' : 0,
      }}
    >
      {hover && !isDragging && (
        <div className={styles.actions} ref={actionsDomRef}>
          <Button icon="sort" ref={drag} style={{ cursor: 'grab' }} />
          <Button icon="delete" onClick={onDelete} />
        </div>
      )}
      {children}
    </div>
  );
}
