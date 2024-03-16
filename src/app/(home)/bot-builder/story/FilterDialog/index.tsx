import { RefObject, useEffect, useRef, useState, type FC } from 'react';
import { Button, Dialog, Input } from '@stylospectrum/ui';
import { ButtonDesign, type IDialog, type IInput } from '@stylospectrum/ui/dist/types';

import Form, { type RuleBuilderForm } from './Form';
import styles from './index.module.scss';
import { botBuilderStoryApi } from '@/api';
import { BotFilter, BotStoryBlock } from '@/model';

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

  function handleClose() {
    dialogRef.current?.hide();
    onClose();
  }

  async function handleSave() {
    const values = formRef.current?._form.value?.getFieldsValue() as BotFilter;
    values.storyBlockId = data.id!;
    const name: string = (inputNameRef.current as any)._innerValue;
    const res = await botBuilderStoryApi.createFilter({
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
    async function fetchApi() {
      const res = await botBuilderStoryApi.getBotFilter(data.id!);

      if (res) {
        dialogRef.current?.show();
        setBlockName(res.storyBlock.name);

        if (res.filter) {
          formRef.current?._form.value?.setFieldsValue(res.filter);
        }
      }
    }

    fetchApi();
  }, [data.id]);

  return (
    <Dialog onMaskClick={handleClose} ref={dialogRef} headerText="Filter" className={styles.dialog}>
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
  );
};

export default FilterDialog;
