import { forwardRef, RefObject, useImperativeHandle, useRef, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';

import ResponseInput, { ResponseInputRef } from '../ResponseInput';
import QuickReplyButton, { QuickReplyButtonRef } from './Button';
import styles from './index.module.scss';
import { BotResponseButton, BotResponseText } from '@/model/bot-response';

import '@stylospectrum/ui/dist/icon/data/add';

export interface ResponseQuickReplyRef {
  getValue: () => { text: BotResponseText; buttons: BotResponseButton[] };
}

interface ResponseQuickReplyProps {
  defaultValue: {
    text: BotResponseText;
    buttons: BotResponseButton[];
  };
}

const ResponseQuickReply = forwardRef<ResponseQuickReplyRef, ResponseQuickReplyProps>(
  ({ defaultValue }, ref) => {
    const [buttons, setButtons] = useState<BotResponseButton[]>(
      defaultValue.buttons.length
        ? defaultValue.buttons
        : [
            {
              id: 'client-' + uuidv4(),
              content: 'Button',
            },
          ],
    );
    const inputRef: RefObject<ResponseInputRef> = useRef(null);
    const buttonsRef = useRef<{ [key: string]: QuickReplyButtonRef }>({});

    function handleAdd() {
      setButtons((prev) => [...prev, { id: 'client-' + uuidv4(), content: 'Button' }]);
    }

    function handleDelete(index: number) {
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
      getValue: () => {
        return {
          text: inputRef.current!.getValue(),
          buttons: buttons.map((button) => {
            const value = buttonsRef.current[button.id!]?.getValues?.();

            return {
              id: button.id?.startsWith('client-') ? undefined : button.id,
              deleted: button.deleted,
              content: value?.content || '',
              go_to: value?.goTo || '',
            };
          }),
        };
      },
    }));

    return (
      <div className={styles.wrapper}>
        <ResponseInput defaultValue={defaultValue.text} ref={inputRef} />

        <div className={styles.buttons}>
          {buttons.map((button, index) => {
            if (button.deleted) {
              return null;
            }

            return (
              <QuickReplyButton
                ref={(el) => (buttonsRef.current[button.id!] = el!)}
                index={index}
                showActions={buttons.length > 1}
                key={button.id}
                onDelete={() => handleDelete(index)}
                moveButton={handleMoveButton}
                defaultValue={button.content}
              />
            );
          })}
          <Button icon="add" type={ButtonDesign.Tertiary} onClick={handleAdd} />
        </div>
      </div>
    );
  },
);

ResponseQuickReply.displayName = 'ResponseQuickReply';

export default ResponseQuickReply;
