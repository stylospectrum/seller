import { DragEvent, MouseEvent, useRef, useState } from 'react';
import { Icon } from '@stylospectrum/ui';
import classNames from 'classnames';
import Image from 'next/image';

import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/upload';

interface ResponseImageProps {
  className?: string;
  width?: number;
  height?: number;
  iconSize?: number;
}

export default function ResponseImage({ className, width, height, iconSize }: ResponseImageProps) {
  const [imageUrl, setImageUrl] = useState<string>();
  const inputDomRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);

  function handleMouseEnter() {
    setHovered(true);
  }

  function handleMouseLeave() {
    setHovered(false);
  }

  function uploadFiles(files: File[]) {
    if (files.length > 0) {
      setImageUrl(URL.createObjectURL(files[0]));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    uploadFiles(files as unknown as File[]);
  }

  function handleClick() {
    inputDomRef.current!.click();
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    if (e.type === 'dragover') {
      return;
    }

    uploadFiles(e.dataTransfer.files as unknown as File[]);
  }

  function handleRemove(e: MouseEvent) {
    e.stopPropagation();
    setImageUrl('');
  }

  return (
    <div
      className={classNames(styles.wrapper, className, { [styles['wrapper-no-image']]: !imageUrl })}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <input
        ref={inputDomRef}
        type="file"
        accept=""
        style={{ display: 'none' }}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
      />
      {imageUrl ? (
        <Image src={imageUrl} width={width || 325} height={height || 260} alt="" />
      ) : (
        <>
          <Icon name="upload" className={styles.icon} style={{ fontSize: `${iconSize}rem` }} />
          <div className={styles.text}>Drag and drop or browse</div>
        </>
      )}

      {imageUrl && hovered && (
        <div className={styles.actions}>
          <div className={styles['actions-bg']} />

          <div className={styles['actions-content']}>
            <Icon name="upload" className={styles.icon} style={{ fontSize: `${iconSize}rem` }} />
            <div className={styles.text}>
              Click to choose a new image
              <br />
              or{' '}
              <span onClick={handleRemove}>
                <u>remove the existing one</u>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
