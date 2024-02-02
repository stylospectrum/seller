import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, Form, Input } from '@stylospectrum/ui';
import { ButtonDesign, IForm } from '@stylospectrum/ui/dist/types';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/delete';

import UserInput from './Input';

interface UserInputDialogProps {
  onClose: () => void;
}

export default function UserInputDialog({ onClose }: UserInputDialogProps) {
  const [inputs, setInputs] = useState<string[]>([uuidv4()]);
  const dialogRef = useRef<any>(null);
  const formRef = useRef<IForm>(null);
  const count = useRef<{ [key: string]: number }>({});

  function handleAdd() {
    setInputs((prev) => [...prev, uuidv4()]);
  }

  function handleDelete(id: string) {
    setInputs((prev) => prev.filter((button) => button !== id));
  }

  function handleClose() {
    dialogRef.current?.hide();
    onClose();
  }

  function handleSave() {
    console.log(formRef.current?.getFieldsValue());
    handleClose();
  }

  useEffect(() => {
    dialogRef.current?.show();
  }, []);

  return (
    <Dialog
      onMaskClick={handleClose}
      ref={dialogRef}
      headerText="User input"
      className={styles.dialog}
    >
      <Input slot="sub-header" style={{ width: '100%' }} />

      <Form ref={formRef} className={styles.form}>
        {inputs.map((id, index) => (
          <UserInput
            key={id}
            id={id}
            showDeleteButton={inputs.length > 1 && index < inputs.length - 1}
            onDelete={handleDelete}
            onChange={(value) => {
              if (value && !(id in count.current)) {
                count.current[id]++;
                handleAdd();
              }
            }}
            onBlur={() => {
              const values = formRef.current?.getFieldsValue();

              if (!values[id] && inputs.length > 1 && index < inputs.length - 1) {
                handleDelete(id);
              }
            }}
          />
        ))}
      </Form>

      <Button slot="ok-button" onClick={handleSave}>
        Save
      </Button>
      <Button slot="cancel-button" type={ButtonDesign.Tertiary} onClick={handleClose}>
        Close
      </Button>
    </Dialog>
  );
}
