import { forwardRef, RefObject, useImperativeHandle, useRef } from 'react';
import { Textarea } from '@stylospectrum/ui';

interface ResponseInputProps {
  defaultValue?: string;
}

export interface ResponseInputRef {
  getValue: () => string;
}

const ResponseInput = forwardRef<ResponseInputRef, ResponseInputProps>(({ defaultValue }, ref) => {
  const textareaRef: RefObject<any> = useRef(null);

  useImperativeHandle(ref, () => ({
    getValue: () => textareaRef.current?._innerValue || defaultValue || '',
  }));

  return (
    <Textarea defaultValue={defaultValue} ref={textareaRef} placeholder="Enter bot response" />
  );
});

ResponseInput.displayName = 'ResponseInput';

export default ResponseInput;
