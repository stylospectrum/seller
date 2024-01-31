import {
  cloneElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  open?: boolean;
  children?: ReactElement;
}

const Portal: FC<PortalProps> = ({ open, children }) => {
  const [container] = useState(() => document.createElement('div'));
  const childrenRef = useRef<any>();
  const clonedChildren = useMemo(() => cloneElement(children!, { ref: childrenRef }), [children]);

  useLayoutEffect(() => {
    const tempRef = childrenRef.current;

    if (open && !container.parentElement) {
      document.body.appendChild(container);
      setTimeout(() => {
        tempRef?.show?.();
      });
    }

    if (!open && container.parentElement) {
      tempRef?.hide?.();

      setTimeout(() => {
        container.parentElement?.removeChild(container);
      });
    }
  }, [open, container]);

  return createPortal(clonedChildren, container);
};

export default Portal;
