import { useMemo, useRef, useState } from 'react';
import {
  BusyIndicator,
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  MessageBox,
  Table,
} from '@stylospectrum/ui';
import { ButtonDesign, IForm } from '@stylospectrum/ui/dist/types';
import { html } from 'lit-html';

import styles from './index.module.scss';
import { useBotVariables, useCreateBotVariable, useDeleteBotVariable } from '@/hooks';
import Portal from '@/utils/Portal';

import '@stylospectrum/ui/dist/icon/data/delete';
import '@stylospectrum/ui/dist/icon/data/decline';
import '@stylospectrum/ui/dist/button';

interface VariableDialogProps {
  visible: boolean;
  onClose: () => void;
}

export default function VariableDialog({ visible, onClose }: VariableDialogProps) {
  const [deletedId, setDeletedId] = useState('');
  const formRef = useRef<IForm>(null);
  const botVariablesQuery = useBotVariables();
  const createBotVariableMutation = useCreateBotVariable();
  const deleteBotVariableMutation = useDeleteBotVariable();
  const showActions = useMemo(
    () => botVariablesQuery.data?.some((variable) => !variable.isSystem && !variable.entity),
    [botVariablesQuery.data],
  );

  const handleDelete = async () => {
    if (deletedId) {
      await deleteBotVariableMutation.mutateAsync(deletedId);
      setDeletedId('');
    }
  };

  const handleAdd = async () => {
    const values = formRef.current?.getFieldsValue() as Record<string, string>;

    if (!values?.name) {
      return;
    }

    await createBotVariableMutation.mutateAsync({ name: values.name });
    formRef.current?.resetFields();
  };

  const columnDefs = useMemo(() => {
    const columns = [
      { field: 'name', headerName: 'Variable name' },
      {
        field: 'entity',
        headerName: 'Entity',
        cellRenderer: (row: any) => row.value?.name || ' ',
      },
      { field: 'description', headerName: 'Description' },
    ];

    if (showActions) {
      columns.push({
        field: 'action',
        headerName: '',
        cellRenderer: (row: any) => {
          if (row.data.isSystem || row.data?.entity?.name) {
            return '';
          }

          return html`<stylospectrum-button
            type="Tertiary"
            icon="decline"
            @click=${() => setDeletedId(row.data.id)}
          >
          </stylospectrum-button>`;
        },
      });
    }

    return columns;
  }, [showActions]);

  return (
    <>
      <Portal
        open={
          botVariablesQuery.isLoading ||
          createBotVariableMutation.isPending ||
          deleteBotVariableMutation.isPending
        }
      >
        <BusyIndicator global />
      </Portal>

      <Portal open={!!deletedId}>
        <MessageBox headerText="Delete variable">
          Are you sure you want to delete selected variable?
          <Button slot="ok-button" onClick={handleDelete}>
            Confirm
          </Button>
          <Button
            slot="cancel-button"
            onClick={() => setDeletedId('')}
            type={ButtonDesign.Tertiary}
          >
            Cancel
          </Button>
        </MessageBox>
      </Portal>

      <Portal open={visible}>
        <Dialog onMaskClick={onClose} headerText="Variable" className={styles.dialog}>
          <Form ref={formRef} initialValues={{}}>
            <FormItem name="name" label="Variable name" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Input allowClear />
                <Button onClick={handleAdd}>Add</Button>
              </div>
            </FormItem>
          </Form>

          <Table
            className={styles.table}
            columnDefs={columnDefs}
            rowData={botVariablesQuery.data || []}
          />

          <Button slot="cancel-button" type={ButtonDesign.Tertiary} onClick={onClose}>
            Close
          </Button>
        </Dialog>
      </Portal>
    </>
  );
}
