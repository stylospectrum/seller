import { forwardRef, MouseEvent, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Block from '../Block';
import BotResponseDialog from '../BotResponseDialog';
import UserInputDialog from '../UserInputDialog';
import { Box } from '../utils/box';
import type { CustomHierarchyNode } from '../utils/hierarchy';
import styles from './index.module.scss';
import BotStoryBlock, { BotStoryBlockType } from '@/model/bot-story-block';

interface ZoomContainerProps {
  blocks?: CustomHierarchyNode<Box>[];
  paths?: string[];
  centerBlock: (block: CustomHierarchyNode<Box>) => void;
}

export default forwardRef<HTMLDivElement, ZoomContainerProps>(function ZoomContainer(
  { blocks, paths, centerBlock },
  ref,
) {
  const [selectedBlock, setSelectedBlock] = useState<BotStoryBlock>();
  const [botResDialogVisible, setBotResDialogVisible] = useState(false);
  const [userInputDialog, setUserInputDialog] = useState(false);

  const handleClick = (e: MouseEvent, block: CustomHierarchyNode<Box>) => {
    if (
      block.data.type === BotStoryBlockType.StartPoint ||
      block.data.type === BotStoryBlockType.DefaultFallback
    ) {
      return;
    }

    e.preventDefault();
    setSelectedBlock(block.data);
    centerBlock(block);

    if (block.data.type === BotStoryBlockType.BotResponse) {
      setBotResDialogVisible(true);
    }

    if (block.data.type === BotStoryBlockType.UserInput) {
      setUserInputDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setUserInputDialog(false);
    setBotResDialogVisible(false);
    setSelectedBlock({} as BotStoryBlock);
  };

  return (
    <>
      <div className={styles.zoom} ref={ref}>
        <div className={styles.diagram} id="diagram">
          <svg className={styles['svg-paths']}>
            {paths?.map((path, idx) => <path d={path} key={`path-${idx}`} />)}
          </svg>

          {blocks?.map((block, index) => (
            <div
              className={styles['block-wrapper']}
              style={block.styleBlock}
              key={`block-${block.data.id}`}
            >
              <Block
                chosen={selectedBlock?.id === block.data.id && index > 0}
                id={block.data.id}
                type={block.data.type}
                title={block.data.name}
                onClick={(e) => {
                  handleClick(e, block);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {botResDialogVisible && (
        <DndProvider backend={HTML5Backend}>
          <BotResponseDialog
            onClose={handleCloseDialog}
            title={selectedBlock?.name}
            id={selectedBlock?.id || ''}
          />
        </DndProvider>
      )}

      {userInputDialog && <UserInputDialog onClose={handleCloseDialog} />}
    </>
  );
});
