import raf from './raf';

function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }

  const r = (cc / 2) * ((t -= 2) * t * t + 2) + b;

  return r;
}

interface ScrollToOptions {
  getContainer?: () => HTMLElement;
  callback?: Function;
  duration?: number;
  direction?: 'left' | 'top';
}

export default function scrollTo(offset: number, options: ScrollToOptions = {}) {
  const { getContainer, callback, duration = 300, direction } = options;
  const container = getContainer?.();
  const { scrollTop, scrollLeft } = container!;
  const startTime = Date.now();

  if (duration === 0) {
    if (direction === 'top') {
      container!.scrollTop = offset;
    } else {
      container!.scrollLeft = offset;
    }
    return;
  }

  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScroll = easeInOutCubic(
      time > duration ? duration : time,
      direction === 'top' ? scrollTop : scrollLeft,
      offset,
      duration,
    );
    if (direction === 'top') {
      container!.scrollTop = nextScroll;
    } else {
      container!.scrollLeft = nextScroll;
    }
    if (time < duration) {
      raf(frameFunc);
    } else if (typeof callback === 'function') {
      callback();
    }
  };
  raf(frameFunc);
}
