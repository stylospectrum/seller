import { forwardRef, MouseEvent, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Block from '../Block';
import BotResponseDialog from '../BotResponseDialog';
import FilterDialog from '../FilterDialog';
import UserInputDialog from '../UserInputDialog';
import { Box } from '../utils/box';
import type { CustomHierarchyNode } from '../utils/hierarchy';
import styles from './index.module.scss';
import { BotStoryBlockType } from '@/enums';
import { BotStoryBlock } from '@/model';

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
  const [userInputDialogVisible, setUserInputDialogVisible] = useState(false);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const [blockName, setBlockName] = useState<{ [key: string]: string }>({});

  const handleClick = (e: MouseEvent, block: CustomHierarchyNode<Box>) => {
    if (
      [
        BotStoryBlockType.StartPoint,
        BotStoryBlockType.DefaultFallback,
        BotStoryBlockType.Fallback,
      ].includes(block.data.type)
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
      setUserInputDialogVisible(true);
    }

    if (block.data.type === BotStoryBlockType.Filter) {
      setFilterDialogVisible(true);
    }
  };

  const handleCloseDialog = () => {
    setFilterDialogVisible(false);
    setUserInputDialogVisible(false);
    setBotResDialogVisible(false);
    setSelectedBlock({} as BotStoryBlock);
  };

  const handleChangeBlockName = (id: string, name: string) => {
    setBlockName((prev) => {
      prev[id] = name;
      return prev;
    });
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
              {/* 
              // @ts-expect-error */}
              <Block
                {...block}
                name={blockName?.[block.data.id] || block.data.name}
                chosen={selectedBlock?.id === block.data.id && index > 0}
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
            onChangeBlockName={handleChangeBlockName}
            onClose={handleCloseDialog}
            data={selectedBlock!}
          />
        </DndProvider>
      )}

      {userInputDialogVisible && (
        <UserInputDialog
          data={selectedBlock!}
          onChangeBlockName={handleChangeBlockName}
          onClose={handleCloseDialog}
        />
      )}

      {filterDialogVisible && (
        <FilterDialog
          data={selectedBlock!}
          onChangeBlockName={handleChangeBlockName}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
});
