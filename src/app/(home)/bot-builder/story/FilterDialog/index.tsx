import { RefObject, useEffect, useRef, useState, type FC } from 'react';
import { BusyIndicator, Button, Dialog, Input } from '@stylospectrum/ui';
import { ButtonDesign, type IDialog, type IInput } from '@stylospectrum/ui/dist/types';

import Form, { type RuleBuilderForm } from './Form';
import styles from './index.module.scss';
import { BotStoryBlockType } from '@/enums';
import { useBotFilter, useCreateBotFilter } from '@/hooks';
import { BotFilter, BotStoryBlock } from '@/model';
import Portal from '@/utils/Portal';

interface FilterDialogProps {
  onClose: () => void;
  onChangeBlockName: (id: string, name: string) => void;
  data: BotStoryBlock;
}

const FilterDialog: FC<FilterDialogProps> = ({ data, onChangeBlockName, onClose }) => {
  const [blockName, setBlockName] = useState(data.name);
  const formRef = useRef<RuleBuilderForm>(null);
  const dialogRef = useRef<IDialog>(null);
  const inputNameRef: RefObject<IInput> = useRef(null);
  const [visible, setVisible] = useState(false);
  const filterQuery = useBotFilter({
    blockId: data.id!,
    allowQuery: !!data.id && data.type === BotStoryBlockType.Filter,
  });
  const createFilterMutation = useCreateBotFilter({ blockId: data.id! });

  function handleClose() {
    setVisible(false);
    onClose();
  }

  async function handleSave() {
    const values = formRef.current?._form.value?.getFieldsValue() as BotFilter;
    values.storyBlockId = data.id!;
    const name: string = (inputNameRef.current as any)._innerValue;
    const res = await createFilterMutation.mutateAsync({
      storyBlock: {
        id: name ? data.id : null,
        name,
      },
      filter: values,
    });

    if (res?.storyBlock) {
      onChangeBlockName(data.id!, res?.storyBlock?.name || '');
    }

    handleClose();
  }

  useEffect(() => {
    if (filterQuery.data) {
      setBlockName(filterQuery.data.storyBlock.name);
      setVisible(true);

      if (filterQuery.data.filter) {
        requestAnimationFrame(() => {
          formRef.current?._form.value?.setFieldsValue(filterQuery.data!.filter);
        });
      }
    }
  }, [filterQuery.data]);

  if (data.type !== BotStoryBlockType.Filter) {
    return null;
  }

  return (
    <>
      <Portal open={filterQuery.isLoading || createFilterMutation.isPending}>
        <BusyIndicator global />
      </Portal>

      <Portal open={visible}>
        <Dialog
          onMaskClick={handleClose}
          ref={dialogRef}
          headerText="Filter"
          className={styles.dialog}
        >
          <Input
            ref={inputNameRef}
            defaultValue={blockName}
            slot="sub-header"
            style={{ width: '100%' }}
          />

          <Form ref={formRef} />

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
};

export default FilterDialog;
