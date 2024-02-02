import { useEffect, useRef, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';
import GalleryItem from './Item';

import '@stylospectrum/ui/dist/icon/data/add';
import '@stylospectrum/ui/dist/icon/data/navigation-right-arrow';
import '@stylospectrum/ui/dist/icon/data/navigation-left-arrow';

import classNames from 'classnames';

const SCROLL_DISTANCE = 272;

export default function ResponseGallery() {
  const [prevButtonVisible, setPrevButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState<string[]>([uuidv4()]);
  const containerDomRef = useRef<HTMLDivElement>(null);
  const scrollContainerDomRef = useRef<HTMLDivElement>(null);
  const prevItemsLength = useRef(items.length);
  const preventScrolling = useRef(false);

  function updateButtonVisibility() {
    if (scrollContainerDomRef.current && containerDomRef.current) {
      const containerWidth = containerDomRef.current.clientWidth;
      const { scrollWidth, scrollLeft } = scrollContainerDomRef.current;

      setPrevButtonVisible(scrollLeft > 0);
      setNextButtonVisible(scrollLeft + containerWidth + 16 < scrollWidth);
    }
  }

  useEffect(() => {
    const { scrollLeft } = scrollContainerDomRef.current!;

    if (preventScrolling.current) {
      prevItemsLength.current = items.length;
      preventScrolling.current = false;
      return;
    }

    updateButtonVisibility();

    scrollContainerDomRef.current?.scrollTo({
      left:
        items.length >= prevItemsLength.current
          ? scrollLeft + SCROLL_DISTANCE
          : scrollLeft - SCROLL_DISTANCE,
      behavior: 'smooth',
    });

    prevItemsLength.current = items.length;
  }, [items.length]);

  useEffect(() => {
    const scrollContainer = scrollContainerDomRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateButtonVisibility);

      // Clean up the event listener on component unmount
      return () => {
        scrollContainer.removeEventListener('scroll', updateButtonVisibility);
      };
    }
  }, []);

  function handleScroll(direction: 'next' | 'prev') {
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

          if (items.length === 2) {
            scrollDistance += 16;
          }
        } else {
          scrollDistance = SCROLL_DISTANCE;
        }

        newActiveIndex++;
      }

      setActiveIndex(newActiveIndex);
      const newScrollLeft = scrollLeft + scrollDistance;

      scrollContainerDomRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  }

  function handleAdd() {
    const newItem = uuidv4();
    setActiveIndex(items.length);
    setItems((prev) => [...prev, newItem]);
  }

  function handleDelete(id: string) {
    const deletedIndex = items.findIndex((item) => item === id);

    if (items[activeIndex] === id) {
      const newItems = items.filter((item) => item !== id);

      if (deletedIndex === items.length - 1) {
        preventScrolling.current = true;
      }

      setItems(newItems);

      if (deletedIndex === 0) {
        setActiveIndex(0);
      } else {
        setActiveIndex(deletedIndex - 1);
      }
    } else {
      preventScrolling.current = true;
      setItems(items.filter((button) => button !== id));
      setActiveIndex(deletedIndex);
    }
  }

  function handleMoveItem(dragIdx: number, hoverIdx: number) {
    setItems((prev) =>
      update(prev, {
        $splice: [
          [dragIdx, 1],
          [hoverIdx, 0, prev[dragIdx]],
        ],
      }),
    );
  }

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
          {items.map((item, index) => (
            <div
              key={item}
              id={`gallery-item-${item}`}
              style={{ opacity: activeIndex === index ? 1 : 0.7 }}
            >
              <GalleryItem
                onDrop={(dropIndex) => {
                  // console.log(dropIndex)
                  // setActiveIndex(items[dropIndex])
                }}
                index={index}
                moveItem={handleMoveItem}
                onDelete={() => handleDelete(item)}
                showActions={items.length > 1}
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
}
