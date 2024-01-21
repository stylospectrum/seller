import { forwardRef, RefObject, useImperativeHandle, useRef, useState } from 'react';
import { Button, Dialog, Icon, Input } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import update from 'immutability-helper';
import Image from 'next/image';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';
import ResponseBlock from './ResponseBlock';
import ResponseContainer from './ResponseContainer';
import ResponseGallery from './ResponseGallery';
import ResponseImage from './ResponseImage';
import ResponseInput from './ResponseInput';
import ResponseQuickReply from './ResponseQuickReply';
import ResponseVariants from './ResponseVariants';

import '@stylospectrum/ui/dist/icon/data/background';
import '@stylospectrum/ui/dist/icon/data/image-viewer';
import '@stylospectrum/ui/dist/icon/data/response';
import '@stylospectrum/ui/dist/icon/data/text-formatting';

interface BotResponseDialogProps {
  onClose: () => void;
}

export default function BotResponseDialog({ onClose }: BotResponseDialogProps) {
  const dropDomRef = useRef<HTMLDivElement>(null);
  const [responses, setResponses] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const getItemHeight = (type: string) => {
    const itemHeight: { [key: string]: number } = {
      text: 62,
      'random-text': 98,
      image: 325,
      gallery: 62,
      'quick-reply': 62,
    };
    return itemHeight[type] || 0;
  };

  const [{ item, isOver }, drop] = useDrop(
    () => ({
      accept: 'BOX',
      drop: (item: any) => {
        setResponses((prev) => {
          const newResponses = [...prev];
          newResponses.splice(hoveredIndex, 0, item.id + '?' + uuidv4());
          return newResponses;
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        item: monitor.getItem<{ icon: string; id: string }>(),
      }),
      hover(_, monitor) {
        monitor.isOver({ shallow: true });
        const hoverBoundingRect = dropDomRef.current!.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        const hoverClientY =
          clientOffset!.y - hoverBoundingRect.top + dropDomRef.current!.scrollTop;

        let newHoveredIndex = responses.length;
        let totalHeight = 0;

        for (let i = 0; i < responses.length; i++) {
          const [itemType] = responses[i].split('?');
          const itemHeight = getItemHeight(itemType);

          totalHeight += itemHeight;

          if (hoverClientY < totalHeight) {
            newHoveredIndex = i;
            break;
          }
        }

        if (hoverClientY >= totalHeight) {
          newHoveredIndex = responses.length;
        }

        setHoveredIndex(newHoveredIndex);
      },
    }),
    [responses, hoveredIndex],
  );

  function handleClose() {
    onClose();
  }

  function handleDeleteResponse(index: number) {
    setResponses((prev) => {
      const newResponses = [...prev];
      newResponses.splice(index, 1);
      return newResponses;
    });
  }

  function handleMoveItem(dragIdx: number, hoverIdx: number) {
    setResponses((prev) => {
      return update(prev, {
        $splice: [
          [dragIdx, 1],
          [hoverIdx, 0, prev[dragIdx]],
        ],
      });
    });
  }

  const noDraggingNode = (
    <div className={styles['no-dragging-wrapper']}>
      <Image src="/images/dragging.png" width={122} height={122} alt="" />
      <div className={styles['no-dragging-title']}>Drag and drop a response here</div>
      <div className={styles['no-dragging-description']}>
        In the menu on the left-hand side, you can select a response you want to send to users.
      </div>
    </div>
  );

  const renderDraggingNode = () => {
    if (!item.icon) {
      return null;
    }

    return (
      <div className={styles['dragging-wrapper']}>
        <div className={styles['dragging-icon-wrapper']}>
          <Icon name={item.icon} className={styles['dragging-icon']} />
        </div>
      </div>
    );
  };

  drop(dropDomRef);

  return (
    <Dialog headerText="Bot response" className={styles.dialog}>
      <Dialog
        hideFooter
        headerText="Responses"
        slot="second-dialog"
        className={styles['response-dialog']}
      >
        <div className={styles['response-dialog-content']}>
          <div className={styles['response-dialog-row']}>
            <ResponseBlock icon="text-formatting" text="Text" id="text" />
            <ResponseBlock icon="text-formatting" text="Random text" id="random-text" />
          </div>

          <div className={styles['response-dialog-row']}>
            <ResponseBlock icon="background" text="Image" id="image" />
            <ResponseBlock icon="image-viewer" text="Gallery" id="gallery" />
          </div>

          <div className={styles['response-dialog-row']}>
            <ResponseBlock icon="response" text="Quick reply" id="quick-reply" />
          </div>
        </div>
      </Dialog>
      <Input slot="sub-header" style={{ width: '100%' }} />

      <div ref={dropDomRef} className={styles.content}>
        {responses.length < 1 && !isOver && noDraggingNode}
        {responses.map((response, idx) => {
          return (
            <div key={response}>
              {hoveredIndex === idx && isOver && (
                <div style={{ marginBottom: '1rem' }}>{renderDraggingNode()}</div>
              )}
              <ResponseContainer
                moveItem={handleMoveItem}
                index={idx}
                isGallery={response.startsWith('gallery')}
                id={response}
                onDelete={() => handleDeleteResponse(idx)}
              >
                {response.startsWith('text') && <ResponseInput />}
                {response.startsWith('random-text') && <ResponseVariants />}
                {response.startsWith('image') && <ResponseImage />}
                {response.startsWith('quick-reply') && <ResponseQuickReply />}
                {response.startsWith('gallery') && <ResponseGallery />}
              </ResponseContainer>
            </div>
          );
        })}
        {hoveredIndex === responses.length && isOver && renderDraggingNode()}
      </div>
      <Button slot="ok-button">Save</Button>
      <Button slot="cancel-button" onClick={handleClose} type={ButtonDesign.Tertiary}>
        Close
      </Button>
    </Dialog>
  );
}
