import { RefObject, useEffect, useRef, useState } from 'react';
import { BusyIndicator, Button, Dialog, Form, Input } from '@stylospectrum/ui';
import { ButtonDesign, IForm, IInput } from '@stylospectrum/ui/dist/types';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';
import UserInput from './Input';
import { BotStoryBlockType } from '@/enums';
import { useBotUserInputs, useCreateBotUserInput } from '@/hooks';
import { BotStoryBlock, BotUserInput } from '@/model';
import Portal from '@/utils/Portal';

import '@stylospectrum/ui/dist/icon/data/delete';

interface UserInputDialogProps {
  onClose: () => void;
  onChangeBlockName: (id: string, name: string) => void;
  data: BotStoryBlock;
}

export default function UserInputDialog({
  onClose,
  data,
  onChangeBlockName,
}: UserInputDialogProps) {
  const [inputs, setInputs] = useState<BotUserInput[]>([]);
  const formRef = useRef<IForm>(null);
  const count = useRef<{ [key: string]: number }>({});
  const [blockName, setBlockName] = useState(data.name);
  const inputNameRef: RefObject<IInput> = useRef(null);
  const [visible, setVisible] = useState(false);
  const userInputsQuery = useBotUserInputs({
    blockId: data.id!,
    allowQuery: !!data.id && data.type === BotStoryBlockType.UserInput,
  });
  const createUserInputMutation = useCreateBotUserInput({
    blockId: data.id!,
  });

  function handleAdd() {
    setInputs((prev) => [
      ...prev,
      {
        content: '',
        id: 'client-' + uuidv4(),
      },
    ]);
  }

  function handleDelete(id: string) {
    if (id.includes('client')) {
      setInputs((prev) => prev.filter((button) => button.id !== id));
    } else {
      setInputs((prev) =>
        prev.map((button) => {
          if (button.id === id) {
            return { ...button, deleted: true };
          }
          return button;
        }),
      );
    }
  }

  function handleClose() {
    setVisible(false);
    onClose();
  }

  async function handleSave() {
    const values = formRef.current?.getFieldsValue();
    const userInputs: BotUserInput[] = inputs.map(
      (input) =>
        new BotUserInput({
          id: input.id?.includes('client') ? null : input.id,
          deleted: input.deleted,
          content: values![input.id!] as string,
          storyBlockId: data.id!,
        }),
    );

    if (!userInputs[userInputs.length - 1].content) {
      userInputs.pop();
    }

    const name: string = (inputNameRef.current as any)._innerValue;
    const res = await createUserInputMutation.mutateAsync({
      storyBlock: {
        id: name ? data.id : null,
        name,
      },
      userInputs,
    });

    if (res?.storyBlock) {
      onChangeBlockName(data.id!, res?.storyBlock?.name || '');
    }

    handleClose();
  }

  useEffect(() => {
    const newInput = { id: 'client-' + uuidv4(), content: '' };

    if (userInputsQuery.data) {
      setBlockName(userInputsQuery.data.storyBlock.name);

      if (userInputsQuery.data.userInputs.length > 0) {
        const formValues: { [key: string]: string } = {};

        userInputsQuery.data.userInputs.forEach((input) => {
          count.current[input.id!] = 1;
          formValues[input.id!] = input.content;
        });

        requestAnimationFrame(() => {
          formRef.current?.setFieldsValue(formValues);
        });

        setInputs([...userInputsQuery.data.userInputs, newInput]);
      } else {
        setInputs([newInput]);
      }
      setVisible(true);
    }
  }, [userInputsQuery.data]);

  if (data.type !== BotStoryBlockType.UserInput) {
    return null;
  }

  return (
    <>
      <Portal open={userInputsQuery.isLoading || createUserInputMutation.isPending}>
        <BusyIndicator global />
      </Portal>

      <Portal open={visible}>
        <Dialog onMaskClick={handleClose} headerText="User input" className={styles.dialog}>
          <Input
            ref={inputNameRef}
            defaultValue={blockName}
            slot="sub-header"
            style={{ width: '100%' }}
          />

          <Form ref={formRef} className={styles.form}>
            {inputs.map((input, index) => {
              if (input.deleted) {
                return null;
              }

              return (
                <UserInput
                  key={input.id}
                  id={input.id!}
                  showDeleteButton={inputs.length > 1 && index < inputs.length - 1}
                  onDelete={handleDelete}
                  onChange={(value) => {
                    if (value && !(input.id! in count.current)) {
                      count.current[input.id!]++;
                      handleAdd();
                    }
                  }}
                  onBlur={() => {
                    const values = formRef.current?.getFieldsValue();

                    if (!values![input.id!] && inputs.length > 1 && index < inputs.length - 1) {
                      handleDelete(input.id!);
                    }
                  }}
                />
              );
            })}
          </Form>

          <Button slot="ok-button" onClick={handleSave}>
            Save
          </Button>
          <Button slot="cancel-button" type={ButtonDesign.Tertiary} onClick={handleClose}>
            Close
          </Button>
        </Dialog>
      </Portal>
    </>
  );
}
