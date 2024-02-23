import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import { v4 as uuidv4 } from 'uuid';

import ResponseInput, { ResponseInputRef } from '../ResponseInput';
import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/add';
import '@stylospectrum/ui/dist/icon/data/delete';

import { BotResponseText } from '@/model/bot-response';

interface ResponseVariantsProps {
  defaultValues: BotResponseText[];
}

export interface ResponseVariantsRef {
  getValues: () => BotResponseText[];
}

const ResponseVariants = forwardRef<ResponseVariantsRef, ResponseVariantsProps>(
  ({ defaultValues }, ref) => {
    const [variants, setVariants] = useState<BotResponseText[]>(
      defaultValues.length ? defaultValues : [{ id: 'client-' + uuidv4(), content: '' }],
    );
    const [activeVariant, setActiveVariant] = useState(variants[0].id);
    const inputRefs = useRef<{ [key: string]: ResponseInputRef }>({});

    function handleAdd() {
      const newVariant: BotResponseText = {
        id: 'client-' + uuidv4(),
        content: '',
      };
      setVariants((prev) => [...prev, newVariant]);
      setActiveVariant(newVariant.id);
    }

    function handleItemClick(id: string) {
      setActiveVariant(id);
    }

    function handleDelete() {
      const activeIndex = variants.findIndex((variant) => variant.id === activeVariant);
      const isClientId = variants[activeIndex].id?.startsWith('client-');
      let newVariants: BotResponseText[] = [];

      if (isClientId) {
        newVariants = variants.filter((variant) => variant.id !== activeVariant);
      } else {
        newVariants = variants.map((variant) =>
          variant.id === activeVariant ? { ...variant, deleted: true } : variant,
        );
      }

      setVariants(newVariants);

      if (!isClientId) {
        newVariants = newVariants.filter((variant) => !variant.deleted);
      }

      setActiveVariant(
        newVariants.length === 1 || activeIndex === 0
          ? newVariants[0].id
          : newVariants[activeIndex - 1].id,
      );
    }

    useImperativeHandle(ref, () => ({
      getValues() {
        return variants.map((variant) => ({
          id: variant.id?.startsWith('client-') ? undefined : variant.id,
          content: inputRefs.current[variant.id!]?.getValue?.()?.content || '',
          deleted: variant.deleted || false,
        }));
      },
    }));

    return (
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <div className={styles.text}>Variants</div>
          <div className={styles.tab}>
            {variants
              .filter((variant) => !variant.deleted)
              .map((variant, index) => {
                return (
                  <Button
                    type={ButtonDesign.Secondary}
                    tabSelected={activeVariant === variant.id}
                    circle
                    key={'tab' + variant.id}
                    onClick={() => handleItemClick(variant.id!)}
                  >
                    {index + 1}
                  </Button>
                );
              })}

            <Button circle type={ButtonDesign.Secondary} icon="add" onClick={handleAdd} />
          </div>
        </div>

        {variants.map((variant) => {
          if (variant.deleted) {
            return null;
          }

          return (
            <div
              key={variant.id}
              className={styles['input-wrapper']}
              style={{ display: variant.id === activeVariant ? undefined : 'none' }}
            >
              {variants.length > 1 && (
                <Button icon="delete" className={styles['delete-button']} onClick={handleDelete} />
              )}
              <ResponseInput
                defaultValue={variant}
                ref={(el) => (inputRefs.current[variant.id!] = el!)}
              />
            </div>
          );
        })}
      </div>
    );
  },
);

ResponseVariants.displayName = 'ResponseVariants';

export default ResponseVariants;
