import { RefObject, useEffect, useRef, useState } from 'react';
import { Button, Dialog, Icon, Input } from '@stylospectrum/ui';
import { ButtonDesign, IDialog, IInput } from '@stylospectrum/ui/dist/types';
import update from 'immutability-helper';
import Image from 'next/image';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';
import ResponseBlock from './ResponseBlock';
import ResponseContainer from './ResponseContainer';
import ResponseGallery, { ResponseGalleryRef } from './ResponseGallery';
import ResponseImage, { ResponseImageRef } from './ResponseImage';
import ResponseInput, { ResponseInputRef } from './ResponseInput';
import ResponseQuickReply, { ResponseQuickReplyRef } from './ResponseQuickReply';
import ResponseVariants, { ResponseVariantsRef } from './ResponseVariants';
import { botBuilderStoryApi } from '@/api';
import { BotStoryBlockType } from '@/enums';
import { BotResponse, BotStoryBlock } from '@/model';
import { BotResponseType } from '@/model/bot-response';

import '@stylospectrum/ui/dist/icon/data/background';
import '@stylospectrum/ui/dist/icon/data/image-viewer';
import '@stylospectrum/ui/dist/icon/data/response';
import '@stylospectrum/ui/dist/icon/data/text-formatting';

interface BotResponseDialogProps {
  data: BotStoryBlock;
  onClose: () => void;
  disabledInputName?: boolean;
  onChangeBlockName: (id: string, name: string) => void;
}

export default function BotResponseDialog({
  onClose,
  data,
  onChangeBlockName,
}: BotResponseDialogProps) {
  const dropDomRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<IDialog>(null);
  const responseInputRefs: RefObject<{ [key: string]: ResponseInputRef }> = useRef({});
  const responseVariantsRef: RefObject<ResponseVariantsRef> = useRef(null);
  const responseQuickReply: RefObject<ResponseQuickReplyRef> = useRef(null);
  const responseImageRef: RefObject<ResponseImageRef> = useRef(null);
  const responseGalleryRef: RefObject<ResponseGalleryRef> = useRef(null);
  const inputNameRef: RefObject<IInput> = useRef(null);
  const [responses, setResponses] = useState<BotResponse[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [blockName, setBlockName] = useState(data.name);

  useEffect(() => {
    async function fetchResponse() {
      const res = await botBuilderStoryApi.getBotResponse(data.id!);

      if (res) {
        setResponses(res.botResponses);
        setBlockName(res.storyBlock.name);
      }
      dialogRef.current?.show();
    }

    fetchResponse();
  }, [data.id]);

  const [{ item, isOver }, drop] = useDrop(
    () => ({
      accept: 'BOX',
      drop: (item: any) => {
        setResponses((prev) => {
          const newResponses = [...prev];
          newResponses.splice(
            hoveredIndex,
            0,
            new BotResponse({ id: 'client-' + uuidv4(), type: item.type }),
          );
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
          const itemHeight = document.getElementById(responses[i].id!)?.clientHeight || 0;

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
    dialogRef.current!.hide();
    onClose();
  }

  function handleDeleteResponse(index: number) {
    if (responses[index].id?.includes('client-')) {
      setResponses((prev) => {
        const newResponses = [...prev];
        newResponses.splice(index, 1);
        return newResponses;
      });
    } else {
      const cloned: BotResponse[] = JSON.parse(JSON.stringify(responses));
      cloned[index].deleted = true;
      setResponses(cloned);
    }
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

  async function handleSave() {
    const input: BotResponse[] = [];

    await Promise.all(
      responses.map(async (response, index) => {
        const id = response.id?.includes('client-') ? undefined : response.id;

        input.push({
          id,
          type: response.type,
          storyBlockId: data.id!,
          deleted: response.deleted,
        });

        if (response.type === BotResponseType.Text) {
          const value = responseInputRefs.current![response.id!]?.getValue?.() || {};
          input[index].variants = [
            {
              id: value.id,
              content: value.content,
              deleted: false,
            },
          ];
        }

        if (response.type === BotResponseType.RandomText) {
          input[index].variants = responseVariantsRef.current?.getValues() || [];
        }

        if (response.type === BotResponseType.QuickReply) {
          const value = responseQuickReply.current?.getValue?.();
          input[index].variants = [
            {
              id: value?.text?.id,
              content: value?.text?.content!,
              deleted: false,
            },
          ];
          input[index].buttons = value?.buttons || [];
        }

        if (response.type === BotResponseType.Image) {
          const id = await responseImageRef.current?.uploadImage();
          input[index].imageId = id;
        }

        if (response.type === BotResponseType.Gallery) {
          input[index].gallery = await responseGalleryRef.current?.getValues()!;
        }
      }),
    );

    const name: string = (inputNameRef.current as any)._innerValue;
    const res = await botBuilderStoryApi.createBotResponse({
      storyBlock: {
        id: name ? data.id : null,
        name,
      },
      botResponses: input,
    });

    if (res?.storyBlock) {
      onChangeBlockName(data.id!, res?.storyBlock?.name || '');
    }

    handleClose();
  }

  function getResponseNode(response: BotResponse) {
    switch (response.type) {
      case BotResponseType.Text:
        return (
          <ResponseInput
            defaultValue={response.variants?.[0]}
            ref={(el) => (responseInputRefs.current![response.id!] = el!)}
          />
        );
      case BotResponseType.RandomText:
        return (
          <ResponseVariants defaultValues={response.variants || []} ref={responseVariantsRef} />
        );
      case BotResponseType.Image:
        return <ResponseImage ref={responseImageRef} src={response.imageUrl} />;
      case BotResponseType.QuickReply:
        return (
          <ResponseQuickReply
            ref={responseQuickReply}
            defaultValue={{ text: response.variants?.[0]!, buttons: response.buttons! }}
          />
        );
      case BotResponseType.Gallery:
        return <ResponseGallery ref={responseGalleryRef} defaultValues={response?.gallery || []} />;
      default:
        return null;
    }
  }

  const renderNoDraggingNode = () => {
    if (responses.filter((response) => !response.deleted).length < 1 && !isOver) {
      return (
        <div className={styles['no-dragging-wrapper']}>
          <Image src="/images/dragging.png" width={122} height={122} alt="" />
          <div className={styles['no-dragging-title']}>Drag and drop a response here</div>
          <div className={styles['no-dragging-description']}>
            In the menu on the left-hand side, you can select a response you want to send to users.
          </div>
        </div>
      );
    }

    return null;
  };

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
    <Dialog
      onMaskClick={handleClose}
      ref={dialogRef}
      headerText="Bot response"
      className={styles.dialog}
    >
      <Dialog
        hideFooter
        headerText="Responses"
        slot="second-dialog"
        className={styles['response-dialog']}
      >
        <div className={styles['response-dialog-content']}>
          <div className={styles['response-dialog-row']}>
            <ResponseBlock icon="text-formatting" text="Text" type={BotResponseType.Text} />
            <ResponseBlock
              icon="text-formatting"
              text="Random text"
              type={BotResponseType.RandomText}
            />
          </div>

          <div className={styles['response-dialog-row']}>
            <ResponseBlock icon="background" text="Image" type={BotResponseType.Image} />
            <ResponseBlock icon="image-viewer" text="Gallery" type={BotResponseType.Gallery} />
          </div>

          <div className={styles['response-dialog-row']}>
            <ResponseBlock icon="response" text="Quick reply" type={BotResponseType.QuickReply} />
          </div>
        </div>
      </Dialog>
      <Input
        disabled={
          (data as any).parent?.type === BotStoryBlockType.StartPoint ||
          (data as any).parent?.type === BotStoryBlockType.DefaultFallback
        }
        ref={inputNameRef}
        slot="sub-header"
        defaultValue={blockName}
        style={{ width: '100%' }}
      />

      <div ref={dropDomRef} className={styles.content}>
        {renderNoDraggingNode()}
        {responses.map((response, idx) => {
          if (response.deleted) {
            return null;
          }

          return (
            <div key={response.id + '-wrapper'}>
              {hoveredIndex === idx && isOver && (
                <div style={{ marginBottom: '1rem' }}>{renderDraggingNode()}</div>
              )}
              <ResponseContainer
                moveItem={handleMoveItem}
                index={idx}
                isGallery={response.type === BotResponseType.Gallery}
                id={response.id!}
                onDelete={() => handleDeleteResponse(idx)}
              >
                {getResponseNode(response)}
              </ResponseContainer>
            </div>
          );
        })}
        {hoveredIndex === responses.length && isOver && renderDraggingNode()}
      </div>
      <Button slot="ok-button" onClick={handleSave}>
        Save
      </Button>
      <Button slot="cancel-button" onClick={handleClose} type={ButtonDesign.Tertiary}>
        Close
      </Button>
    </Dialog>
  );
}
