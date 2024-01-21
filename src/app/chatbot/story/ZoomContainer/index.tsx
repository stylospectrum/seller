import { forwardRef, MouseEvent, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Block from '../Block';
import BotResponseDialog from '../BotResponseDialog';
import UserInputDialog from '../UserInputDialog';
import { Box } from '../utils/box';
import type { CustomHierarchyNode } from '../utils/hierarchy';
import styles from './index.module.scss';

interface ZoomContainerProps {
  hierarchyTree: {
    tree: CustomHierarchyNode<Box>;
    map: {
      [key: string]: CustomHierarchyNode<Box>;
    };
    array: CustomHierarchyNode<Box>[];
  };
  paths: string[];
  centerBlock: (block: CustomHierarchyNode<Box>) => void;
}

export default forwardRef<HTMLDivElement, ZoomContainerProps>(function ZoomContainer(
  { hierarchyTree, paths, centerBlock },
  ref,
) {
  const [diagram, setDiagram] = useState<{ blocks?: CustomHierarchyNode<Box>[]; paths?: string[] }>(
    {},
  );
  const [selectedBlock, setSelectedBlock] = useState('');
  const [botResDialogVisible, setBotResDialogVisible] = useState(false);
  const [userInputDialog, setUserInputDialog] = useState(false);

  useEffect(() => {
    setDiagram({
      blocks: hierarchyTree.array,
      paths,
    });

    // eslint-disable-next-line
  }, []);

  const handleClick = (e: MouseEvent, block: CustomHierarchyNode<Box>) => {
    if (block.data.type === 'START_POINT' || block.data.type === 'DEFAULT_FALLBACK') {
      return;
    }

    e.preventDefault();
    setSelectedBlock(block.data.id);
    centerBlock(block);

    if (block.data.type === 'BOT_RESPONSE') {
      setBotResDialogVisible(true);
    }

    if (block.data.type === 'USER_INPUT') {
      setUserInputDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setUserInputDialog(false);
    setBotResDialogVisible(false);
    setSelectedBlock('');
  };

  return (
    <>
      <div className={styles.zoom} ref={ref}>
        <div className={styles.diagram} id="diagram">
          <svg className={styles['svg-paths']}>
            {diagram.paths?.map((path, idx) => <path d={path} key={`path-${idx}`} />)}
          </svg>

          {diagram.blocks?.map((block) => (
            <div
              className={styles['block-wrapper']}
              style={block.styleBlock}
              key={`block-${block.data.id}`}
            >
              <Block
                chosen={selectedBlock === block.data.id}
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
          <BotResponseDialog onClose={handleCloseDialog} />
        </DndProvider>
      )}

      {userInputDialog && <UserInputDialog onClose={handleCloseDialog} />}
    </>
  );
});
