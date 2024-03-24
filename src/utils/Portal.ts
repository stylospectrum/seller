'use client';

import { useLayoutEffect, useState, type FC, type ReactElement } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  open: boolean;
  children: ReactElement;
}

const Portal: FC<PortalProps> = ({ open, children }) => {
  const [container] = useState(() => document.createElement('div'));

  useLayoutEffect(() => {
    if (open && !container.parentElement) {
      document.body.appendChild(container);
    }

    if (!open && container.parentElement) {
      setTimeout(() => {
        container.parentElement?.removeChild(container);
      });
    }
  }, [open, container]);

  return createPortal(children, container);
};

export default Portal;
