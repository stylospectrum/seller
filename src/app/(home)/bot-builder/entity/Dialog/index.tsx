import { FC, RefObject, useMemo, useRef } from 'react';
import { BusyIndicator, Button, Dialog, Form, FormItem, FormList, Input } from '@stylospectrum/ui';
import { ButtonDesign, IForm } from '@stylospectrum/ui/dist/types';
import classNames from 'classnames';
import { html } from 'lit';

import styles from './index.module.scss';
import Portal from '@/utils/Portal';

import '@stylospectrum/ui/dist/icon/data/less';
import '@stylospectrum/ui/dist/button';
import '@stylospectrum/ui/dist/form/form-item';
import '@stylospectrum/ui/dist/multi-input';
import '@stylospectrum/ui/dist/input';

import { useCreateBotEntity, useUpdateBotEntity } from '@/hooks';

interface BotEntityDialogProps {
  open: boolean;
  onClose: () => void;
  selectedEntity: Record<string, any> | null;
}

const BotEntityDialog: FC<BotEntityDialogProps> = ({ open, onClose, selectedEntity }) => {
  const formRef: RefObject<IForm> = useRef(null);
  const deletedSynonymIds = useRef<{ [key: string]: Record<string, any>[] }>({});
  const deletedOptions = useRef<Record<string, any>[]>([]);
  const initialValues = useMemo(() => {
    if (selectedEntity) {
      return {
        name: selectedEntity.name,
        options: selectedEntity.children.map((option: Record<string, any>) => ({
          id: option.id,
          name: option.option,
          synonyms: option.synonyms.map((synonym: Record<string, any>) => ({
            id: synonym.id,
            name: synonym.name,
          })),
        })),
      };
    }

    return { options: [''] };
  }, [selectedEntity]);
  const createEntityMutation = useCreateBotEntity();
  const updateEntityMutation = useUpdateBotEntity();

  const handleDeleteSynonym = (option: Record<string, any>, synonymId: string) => {
    if (!(option.id in deletedSynonymIds)) {
      deletedSynonymIds.current[option.id] = [];
    }
    const synonym = option.synonyms.find(
      (synonym: Record<string, any>) => synonym.id === synonymId,
    );

    deletedSynonymIds.current[option.id].push({
      id: synonym.id,
      name: synonym.name,
      deleted: true,
    });
  };

  const handleDeleteOption = (value: Record<string, any>) => {
    deletedOptions.current.push({
      id: value.id,
      name: value.name,
      deleted: true,
      synonyms: [],
    });
  };

  const handleClose = () => {
    deletedSynonymIds.current = {};
    deletedOptions.current = [];
    onClose();
  };

  const handleSave = () => {
    formRef.current?.validateFields().then(async (values: any) => {
      if (values) {
        if (selectedEntity) {
          const options = values.options.map((option: Record<string, any>) => {
            const deletedSynonyms = deletedSynonymIds.current[option.id] || [];
            const synonyms = (option.synonyms || []).map((synonym: Record<string, any>) => {
              return {
                id: synonym.id.includes('client') ? undefined : synonym.id,
                name: synonym.name,
              };
            });

            return {
              id: option.id,
              name: option.name,
              synonyms: [...deletedSynonyms, ...synonyms],
              deleted: false,
            };
          });
          await updateEntityMutation.mutateAsync({
            id: selectedEntity.id,
            name: values.name,
            options: [...deletedOptions.current, ...options],
          });
        } else {
          await createEntityMutation.mutateAsync({
            name: values.name,
            options: values.options.map((option: any) => ({
              name: option.name,
              synonyms: (option.synonyms || []).map((synonym: any) => ({
                name: synonym.name,
              })),
            })),
          });
        }

        handleClose();
      }
    });
  };

  return (
    <>
      <Portal open={createEntityMutation.isPending || updateEntityMutation.isPending}>
        <BusyIndicator global />
      </Portal>

      <Portal open={open}>
        <Dialog headerText="Entity" onMaskClick={onClose} className={styles.dialog}>
          <Form ref={formRef} initialValues={initialValues} className={styles.form}>
            <FormItem
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Enter entity name' }]}
            >
              <Input style={{ width: '13.75rem' }} />
            </FormItem>

            <div className={styles.row}>
              <div className={classNames(styles.label, styles['first-col'])}>Option</div>
              <div className={classNames(styles.label, styles['first-col'])}>Synonyms</div>
            </div>

            <FormList
              name="options"
              renderChild={(name: number, value: Record<string, any>) => {
                return html`<div style="display:flex;gap:.5rem;align-items:center;margin-top:.5rem">
                  <stylospectrum-form-item
                    .name=${[name, 'id']}
                    style="margin-bottom:0;display:none;"
                  >
                    <div></div>
                  </stylospectrum-form-item>

                  <stylospectrum-form-item .name=${[name, 'name']} style="margin-bottom:0">
                    <stylospectrum-input style="width: 13.75rem;"></stylospectrum-input>
                  </stylospectrum-form-item>

                  <stylospectrum-form-item .name=${[name, 'synonyms']} style="margin-bottom:0">
                    <stylospectrum-multi-input
                      @token-delete=${(e: CustomEvent) => handleDeleteSynonym(value, e.detail)}
                      style="width: 18.75rem;"
                    >
                    </stylospectrum-multi-input>
                  </stylospectrum-form-item>

                  <stylospectrum-button
                    icon="less"
                    type="Tertiary"
                    @click=${() => {
                      formRef.current?.list.options.delete(name);
                      handleDeleteOption(value);
                    }}
                  >
                  </stylospectrum-button>
                </div> `;
              }}
            />
            <Button
              style={{ width: '100%', marginTop: '.5rem' }}
              type={ButtonDesign.Tertiary}
              onClick={() => formRef.current?.list.options.add()}
            >
              Add option
            </Button>
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
};

export default BotEntityDialog;
