'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { Button, MessageBox, Table } from '@stylospectrum/ui';
import { ButtonDesign, ITable } from '@stylospectrum/ui/dist/types';

import BotEntityDialog from './Dialog';
import styles from './index.module.scss';
import { botBuilderEntityApi } from '@/api';
import { BotEntity } from '@/model';
import Portal from '@/utils/Portal';

const BotEntityPage = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [entities, setEntities] = useState<BotEntity[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<BotEntity[]>([]);
  const [addBtnClicked, setAddBtnClicked] = useState(false);
  const [msgBoxVisible, setMsgBoxVisible] = useState(false);
  const tableRef: RefObject<ITable> = useRef(null);

  async function fetchEntities() {
    const res = await botBuilderEntityApi.getEntities();

    if (res) {
      setEntities(res);
    }
  }

  function handleClose() {
    setDialogVisible(false);
    fetchEntities();
    tableRef.current?.uncheckedAll();
  }

  async function handleConfirmDelete() {
    const entityIds = selectedEntities.map((entity) => entity.id!);
    await botBuilderEntityApi.deleteEntities(entityIds);
    setMsgBoxVisible(false);
    handleClose();
  }

  useEffect(() => {
    fetchEntities();
  }, []);

  return (
    <>
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
          onSelect={(e) => setSelectedEntities((e as CustomEvent).detail)}
          rowData={entities.map((entity) => {
            return {
              id: entity.id,
              name: entity.name,
              children: entity.options.map((option) => ({
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
