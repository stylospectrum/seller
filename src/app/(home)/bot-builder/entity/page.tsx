'use client';

import { RefObject, useRef, useState } from 'react';
import { BusyIndicator, Button, MessageBox, Table } from '@stylospectrum/ui';
import { ButtonDesign, ITable } from '@stylospectrum/ui/dist/types';

import BotEntityDialog from './Dialog';
import styles from './index.module.scss';
import { useBotEntities, useDeleteBotEntities } from '@/hooks';
import { BotEntity } from '@/model';
import Portal from '@/utils/Portal';

const BotEntityPage = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState<BotEntity[]>([]);
  const [addBtnClicked, setAddBtnClicked] = useState(false);
  const [msgBoxVisible, setMsgBoxVisible] = useState(false);
  const tableRef: RefObject<ITable> = useRef(null);
  const entitiesQuery = useBotEntities();
  const deleteEntitiesMutation = useDeleteBotEntities();

  function handleClose() {
    setDialogVisible(false);
    tableRef.current?.uncheckedAll();
  }

  async function handleConfirmDelete() {
    const entityIds = selectedEntities.map((entity) => entity.id!);
    await deleteEntitiesMutation.mutateAsync(entityIds);
    setMsgBoxVisible(false);
    handleClose();
  }

  return (
    <>
      <Portal open={entitiesQuery.isLoading || deleteEntitiesMutation.isPending}>
        <BusyIndicator global />
      </Portal>

      <div className={styles.container}>
        <div className={styles.actions}>
          <Button
            onClick={() => {
              setDialogVisible(true);
              setAddBtnClicked(true);
            }}
          >
            Add
          </Button>
          <Button
            onClick={() => {
              setDialogVisible(true);
              setAddBtnClicked(false);
            }}
            type={ButtonDesign.Tertiary}
            disabled={selectedEntities.length !== 1}
          >
            Edit
          </Button>
          <Button
            type={ButtonDesign.Tertiary}
            disabled={selectedEntities.length < 1}
            onClick={() => setMsgBoxVisible(true)}
          >
            Delete
          </Button>
        </div>

        <Table
          ref={tableRef}
          allowSelect
          onSelect={(e) => setSelectedEntities((e as CustomEvent).detail)}
          rowData={(entitiesQuery.data || []).map((entity) => {
            return {
              id: entity.id,
              name: entity.name,
              children: (entity.options || []).map((option) => ({
                id: option.id,
                option: option.name,
                synonyms: option.synonyms || [],
              })),
            };
          })}
          columnDefs={[
            { headerName: 'Name', field: 'name' },
            { headerName: 'Option', field: 'option' },
            {
              headerName: 'Synonyms',
              field: 'synonyms',
              cellRenderer: ({ value }: any) =>
                value.map((synonym: any) => synonym.name).join(', '),
            },
          ]}
        />
      </div>

      <BotEntityDialog
        selectedEntity={addBtnClicked ? null : selectedEntities[0]}
        open={dialogVisible}
        onClose={handleClose}
      />

      <Portal open={msgBoxVisible}>
        <MessageBox headerText="Delete entity">
          {selectedEntities.length > 1
            ? 'Are you sure you want to delete selected entities?'
            : 'Are you sure you want to delete selected entity?'}

          <Button slot="ok-button" onClick={handleConfirmDelete}>
            Confirm
          </Button>
          <Button
            slot="cancel-button"
            onClick={() => setMsgBoxVisible(false)}
            type={ButtonDesign.Tertiary}
          >
            Cancel
          </Button>
        </MessageBox>
      </Portal>
    </>
  );
};

export default BotEntityPage;
