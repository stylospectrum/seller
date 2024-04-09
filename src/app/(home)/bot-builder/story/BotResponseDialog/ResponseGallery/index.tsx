import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import classNames from 'classnames';
import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';
import GalleryItem, { GalleryItemRef } from './Item';
import { BotResponseGalleryItem } from '@/model';

import '@stylospectrum/ui/dist/icon/data/add';
import '@stylospectrum/ui/dist/icon/data/navigation-right-arrow';
import '@stylospectrum/ui/dist/icon/data/navigation-left-arrow';

import scrollTo from '@/utils/scrollTo';

const SCROLL_DISTANCE = 272;

interface ResponseGalleryProps {
  defaultValues: BotResponseGalleryItem[];
}

export interface ResponseGalleryRef {
  getValues: () => Promise<BotResponseGalleryItem[]>;
}

const ResponseGallery = forwardRef<ResponseGalleryRef, ResponseGalleryProps>(
  ({ defaultValues }, ref) => {
    const [prevButtonVisible, setPrevButtonVisible] = useState(false);
    const [nextButtonVisible, setNextButtonVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [items, setItems] = useState<BotResponseGalleryItem[]>(
      defaultValues.length
        ? defaultValues
        : [
            {
              id: 'client-' + uuidv4(),
            },
          ],
    );
    const containerDomRef = useRef<HTMLDivElement>(null);
    const scrollContainerDomRef = useRef<HTMLDivElement>(null);
    const prevItemsLength = useRef(items.length);
    const preventScrolling = useRef(true);
    const itemsRef = useRef<{ [key: string]: GalleryItemRef }>({});
    const filteredItems = useRef(items);

    function updateButtonVisibility() {
      requestAnimationFrame(() => {
        if (scrollContainerDomRef.current && containerDomRef.current) {
          const containerWidth = containerDomRef.current.clientWidth;
          const { scrollWidth, scrollLeft } = scrollContainerDomRef.current;

          setPrevButtonVisible(scrollLeft > 0);
          setNextButtonVisible(scrollLeft + containerWidth + 16 < scrollWidth);
        }
      });
    }

    useEffect(() => {
      const scrollContainer = scrollContainerDomRef.current;

      scrollContainer?.addEventListener('scroll', updateButtonVisibility);

      return () => {
        scrollContainer?.removeEventListener('scroll', updateButtonVisibility);
      };
    }, []);

    useEffect(() => {
      updateButtonVisibility();
      filteredItems.current = items.filter((item) => !item.deleted);

      if (preventScrolling.current) {
        prevItemsLength.current = filteredItems.current.length;
        return;
      }

      const { scrollLeft } = scrollContainerDomRef.current!;

      scrollTo(
        filteredItems.current.length >= prevItemsLength.current
          ? scrollLeft + SCROLL_DISTANCE
          : scrollLeft - SCROLL_DISTANCE,
        {
          getContainer: () => scrollContainerDomRef.current!,
        },
      );

      prevItemsLength.current = filteredItems.current.length;
    }, [items]);

    function handleScroll(direction: 'next' | 'prev', callback?: Function) {
      if (scrollContainerDomRef.current) {
        let scrollDistance = 0;
        let newActiveIndex = activeIndex;
        const { scrollLeft } = scrollContainerDomRef.current;

        if (direction === 'prev') {
          scrollDistance = -SCROLL_DISTANCE;
          newActiveIndex--;
        }

        if (direction === 'next') {
          if (newActiveIndex === 0) {
            scrollDistance = SCROLL_DISTANCE / 2 + 16;

            if (filteredItems.current.length === 2) {
              scrollDistance += 16;
            }
          } else {
            scrollDistance = SCROLL_DISTANCE;
          }

          newActiveIndex++;
        }

        const newScrollLeft = scrollLeft + scrollDistance;
        preventScrolling.current = false;

        setActiveIndex(newActiveIndex);

        scrollTo(newScrollLeft, {
          getContainer: () => scrollContainerDomRef.current!,
          callback,
        });
      }
    }

    function handleAdd() {
      preventScrolling.current = false;
      setActiveIndex(filteredItems.current.length);
      setItems((prev) => [...prev, { id: 'client-' + uuidv4() }]);
    }

    function handleDelete(id: string) {
      let index = filteredItems.current.findIndex((item) => item.id === id);

      if (activeIndex === index) {
        if (index === filteredItems.current.length - 1) {
          preventScrolling.current = true;
        }

        if (index === 0) {
          setActiveIndex(0);
        } else {
          setActiveIndex(index - 1);
        }
      } else {
        preventScrolling.current = true;
        setActiveIndex(index);
      }

      index = items.findIndex((item) => item.id === id);

      if (id.includes('client-')) {
        setItems((prev) => {
          const newResponses = [...prev];
          newResponses.splice(index, 1);
          return newResponses;
        });
      } else {
        const cloned: BotResponseGalleryItem[] = JSON.parse(JSON.stringify(items));
        cloned[index].deleted = true;
        setItems(cloned);
      }
    }

    function handleMoveItem(dragIdx: number, hoverIdx: number) {
      preventScrolling.current = true;
      setItems((prev) =>
        update(prev, {
          $splice: [
            [dragIdx, 1],
            [hoverIdx, 0, prev[dragIdx]],
          ],
        }),
      );
    }

    useImperativeHandle(ref, () => ({
      getValues: () =>
        Promise.all(
          items.map(async (item) => {
            const value = await itemsRef.current[item.id!]?.getValue();

            return {
              id: item.id?.startsWith('client-') ? undefined : item.id,
              deleted: item.deleted,
              title: value?.title,
              description: value?.description,
              buttons: value?.buttons || [],
              imageId: value?.imageId,
            };
          }),
        ),
    }));

    return (
      <div className={styles.container} ref={containerDomRef}>
        {prevButtonVisible && (
          <Button
            icon="navigation-left-arrow"
            className={classNames(styles['nav-button'], styles['nav-button-prev'])}
            circle
            type={ButtonDesign.Secondary}
            onClick={() => handleScroll('prev')}
          />
        )}

        {nextButtonVisible && (
          <Button
            icon="navigation-right-arrow"
            className={classNames(styles['nav-button'], styles['nav-button-next'])}
            circle
            type={ButtonDesign.Secondary}
            onClick={() => handleScroll('next')}
          />
        )}

        <div
          className={styles['scroll-container']}
          ref={scrollContainerDomRef}
          style={{ marginLeft: prevButtonVisible ? '-1rem' : 0 }}
        >
          <div className={styles.items}>
            {items
              .filter((item) => !item.deleted)
              .map((item, index) => (
                <div
                  key={item.id}
                  id={`gallery-item-${item.id}`}
                  style={{ opacity: activeIndex === index ? 1 : 0.7 }}
                  onClick={() => {
                    if (index !== activeIndex) {
                      handleScroll(index < activeIndex ? 'prev' : 'next');
                    }
                  }}
                >
                  <GalleryItem
                    ref={(el) => (itemsRef.current[item.id!] = el!)}
                    index={index}
                    moveItem={handleMoveItem}
                    onDelete={() => handleDelete(item.id!)}
                    showActions={filteredItems.current.length > 1}
                    defaultValue={item}
                    onButtonClick={(callback) => {
                      if (index !== activeIndex) {
                        handleScroll(index < activeIndex ? 'prev' : 'next', callback);
                      } else {
                        callback();
                      }
                    }}
                  />
                </div>
              ))}
          </div>

          <div className={styles['add-item']}>
            <div className={styles['add-item-line']}></div>
            <Button icon="add" onClick={handleAdd} circle type={ButtonDesign.Secondary} />
            <div className={styles['add-item-text']}>Add card</div>
          </div>
        </div>
      </div>
    );
  },
);

ResponseGallery.displayName = 'ResponseGallery';

export default ResponseGallery;
