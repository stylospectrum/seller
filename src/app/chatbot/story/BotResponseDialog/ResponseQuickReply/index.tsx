import { useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';

import ResponseInput from '../ResponseInput';
import styles from './index.module.scss';
import QuickReplyButton from './QuickReplyButton';

import '@stylospectrum/ui/dist/icon/data/add';

export default function ResponseQuickReply() {
  const [buttons, setButtons] = useState<string[]>([uuidv4()]);

  function handleAdd() {
    setButtons([...buttons, uuidv4()]);
  }

  function handleDelete(id: string) {
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

  return (
    <div className={styles.wrapper}>
      <ResponseInput />

      <div className={styles.buttons}>
        {buttons.map((button, index) => (
          <QuickReplyButton
            index={index}
            showActions={buttons.length > 1}
            key={button}
            onDelete={() => handleDelete(button)}
            moveButton={handleMoveButton}
          />
        ))}
        <Button icon="add" type={ButtonDesign.Tertiary} onClick={handleAdd} />
      </div>
    </div>
  );
}
