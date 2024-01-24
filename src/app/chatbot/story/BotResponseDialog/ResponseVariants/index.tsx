import { useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import { v4 as uuidv4 } from 'uuid';

import ResponseInput from '../ResponseInput';
import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/add';
import '@stylospectrum/ui/dist/icon/data/delete';

export default function ResponseVariants() {
  const [variants, setVariants] = useState<string[]>([uuidv4()]);
  const [activeVariant, setActiveVariant] = useState(variants[0]);

  function handleAdd() {
    const newId = uuidv4();
    setVariants((prev) => [...prev, newId]);
    setActiveVariant(newId);
  }

  function handleItemClick(id: string) {
    setActiveVariant(id);
  }

  function handleDelete() {
    const activeIndex = variants.findIndex((variant) => variant === activeVariant);
    const newVariants = variants.filter((variant) => variant !== activeVariant);
    setVariants(newVariants);
    setActiveVariant(
      newVariants.length === 1 || activeIndex === 0 ? newVariants[0] : newVariants[activeIndex - 1],
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.text}>Variants</div>
        <div className={styles.tab}>
          {variants.map((variant, index) => (
            <Button
              type={ButtonDesign.Secondary}
              tabSelected={activeVariant === variant}
              circle
              key={'tab' + variant}
              onClick={() => handleItemClick(variant)}
            >
              {index + 1}
            </Button>
          ))}

          <Button circle type={ButtonDesign.Secondary} icon="add" onClick={handleAdd} />
        </div>
      </div>

      {variants.map((variant) => (
        <div
          key={variant}
          className={styles['input-wrapper']}
          style={{ display: variant === activeVariant ? undefined : 'none' }}
        >
          {variants.length > 1 && (
            <Button icon="delete" className={styles['delete-button']} onClick={handleDelete} />
          )}
          <ResponseInput />
        </div>
      ))}
    </div>
  );
}
