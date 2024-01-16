import { forwardRef, useEffect, useState } from 'react';

import Block from '../Block';
import type { CustomHierarchyNode } from '../utils/hierarchy';
import styles from './index.module.scss';

interface ZoomContainerProps {
  hierarchyTree: {
    tree: CustomHierarchyNode<any>;
    map: {
      [key: string]: CustomHierarchyNode<any>;
    };
    array: CustomHierarchyNode<any>[];
  };
  paths: string[];
}

export default forwardRef<HTMLDivElement, ZoomContainerProps>(function ZoomContainer(
  { hierarchyTree, paths },
  ref,
) {
  const [diagram, setDiagram] = useState<{ blocks?: any[]; paths?: any[] }>({});

  useEffect(() => {
    setDiagram({
      blocks: hierarchyTree.array,
      paths,
    });

    // eslint-disable-next-line
  }, []);

  return (
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
            // onClick={() => centerBlock(block)}
          >
            <Block type={block.data.type} title={block.data.name} />
          </div>
        ))}
      </div>
    </div>
  );
});
