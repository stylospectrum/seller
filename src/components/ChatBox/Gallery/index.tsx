import { FC, useEffect, useRef, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign } from '@stylospectrum/ui/dist/types';
import classNames from 'classnames';
import Image from 'next/image';

import styles from './index.module.scss';
import { BotResponseType } from '@/enums';
import { MessageGalleryItem } from '@/model';

const SCROLL_DISTANCE = 240;

interface ChatBoxGalleryProps {
  data: MessageGalleryItem[];
  onButtonClick: Function;
}

const ChatBoxGallery: FC<ChatBoxGalleryProps> = ({ data, onButtonClick }) => {
  const scrollContainerDomRef = useRef<HTMLDivElement>(null);
  const containerDomRef = useRef<HTMLDivElement>(null);
  const [prevButtonVisible, setPrevButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateButtonVisibility() {
    if (scrollContainerDomRef.current && containerDomRef.current) {
      const containerWidth = containerDomRef.current.clientWidth;
      const { scrollWidth, scrollLeft } = scrollContainerDomRef.current;

      setPrevButtonVisible(scrollLeft > 0);
      setNextButtonVisible(scrollLeft + containerWidth + 16 < scrollWidth);
    }
  }

  useEffect(() => {
    updateButtonVisibility();

    const scrollContainer = scrollContainerDomRef.current;

    scrollContainer?.addEventListener('scroll', updateButtonVisibility);

    return () => {
      scrollContainer?.removeEventListener('scroll', updateButtonVisibility);
    };
  }, []);

  function handleScroll(direction: 'next' | 'prev') {
    if (scrollContainerDomRef.current) {
      let scrollDistance = 0;
      let newActiveIndex = activeIndex;
      const { scrollLeft } = scrollContainerDomRef.current;

      if (direction === 'prev') {
        if (newActiveIndex === data.length - 1) {
          scrollDistance = -SCROLL_DISTANCE + 48;
        } else {
          scrollDistance = -SCROLL_DISTANCE;
        }

        newActiveIndex--;
      }

      if (direction === 'next') {
        if (newActiveIndex === 0) {
          scrollDistance = SCROLL_DISTANCE - 48;
        } else {
          scrollDistance = SCROLL_DISTANCE;
        }

        newActiveIndex++;
      }

      const newScrollLeft = scrollLeft + scrollDistance;

      setActiveIndex(newActiveIndex);

      scrollContainerDomRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
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

      <div className={styles['scroll-container']} ref={scrollContainerDomRef}>
        <div className={styles.items}>
          {data.map((item, index) => (
            <div
              key={item.title}
              id={`gallery-item-${index}`}
              style={{ opacity: activeIndex === index ? 1 : 0.7 }}
            >
              <div className={styles['item-card']}>
                {item.imgUrl ? (
                  <Image src={item.imgUrl} width={240} height={145} alt="" />
                ) : (
                  <div style={{ height: 145, width: 240 }} />
                )}
                <div className={styles['item-title']}>{item.title}</div>
                <div className={styles['item-description']}>{item.description}</div>
                <div className={styles['item-button-container']}>
                  {item.buttons.map((button, idx) => (
                    <div
                      key={`msg-gallery-item-button-${idx}`}
                      className={styles['item-button']}
                      onClick={() => {
                        if (index !== activeIndex) {
                          handleScroll(index < activeIndex ? 'prev' : 'next');
                        }

                        onButtonClick(button.goTo, {
                          exprs: button.exprs,
                          botResponseType: BotResponseType.Gallery,
                          isButtonClick: true,
                        });
                      }}
                    >
                      <span className={styles['item-button-text']}>{button.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBoxGallery;
