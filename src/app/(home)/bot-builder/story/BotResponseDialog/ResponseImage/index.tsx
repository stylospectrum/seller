import { DragEvent, forwardRef, MouseEvent, useImperativeHandle, useRef, useState } from 'react';
import { Icon } from '@stylospectrum/ui';
import axios from 'axios';
import classNames from 'classnames';
import Image from 'next/image';

import styles from './index.module.scss';
import { fileApi } from '@/api';

import '@stylospectrum/ui/dist/icon/data/upload';

interface ResponseImageProps {
  className?: string;
  width?: number;
  height?: number;
  iconSize?: number;
  src?: string;
}

export interface ResponseImageRef {
  uploadImage: () => Promise<string | undefined>;
}

const ResponseImage = forwardRef<ResponseImageRef, ResponseImageProps>(
  ({ className, width, height, iconSize, src }, ref) => {
    const [imageUrl, setImageUrl] = useState<string>(src!);
    const inputDomRef = useRef<HTMLInputElement>(null);
    const [hovered, setHovered] = useState(false);
    const presignedUrl = useRef<{ fields: { [key: string]: string }; url: string }>();

    function handleMouseEnter() {
      setHovered(true);
    }

    function handleMouseLeave() {
      setHovered(false);
    }

    async function uploadFiles(files: File[]) {
      if (files.length > 0) {
        const res = await fileApi.getPresignedPost();
        presignedUrl.current = res.data;
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

    function extractKeyFromUrl(url: string) {
      const match = url?.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
      return match?.[0];
    }

    useImperativeHandle(ref, () => ({
      uploadImage: async () => {
        if (presignedUrl.current) {
          const blob = await fetch(imageUrl!).then((r) => r.blob());
          const formData = new FormData();
          Object.entries(presignedUrl.current!.fields).forEach(([k, v]) => {
            formData.append(k, v);
          });
          formData.append('file', blob);

          axios.post(presignedUrl.current!.url, formData);
        }

        return presignedUrl.current?.fields?.key || extractKeyFromUrl(imageUrl!) || '';
      },
    }));

    return (
      <div
        className={classNames(styles.wrapper, className, {
          [styles['wrapper-no-image']]: !imageUrl,
        })}
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
          <Image
            src={imageUrl}
            style={{ objectFit: 'contain' }}
            width={width || 325}
            height={height || 260}
            alt=""
          />
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
  },
);

ResponseImage.displayName = 'ResponseImage';

export default ResponseImage;
