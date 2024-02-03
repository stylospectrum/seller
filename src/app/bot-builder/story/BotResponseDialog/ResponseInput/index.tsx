import { forwardRef, RefObject, useImperativeHandle, useRef } from 'react';
import { Textarea } from '@stylospectrum/ui';

import { BotResponseText } from '@/model/bot-response';

interface ResponseInputProps {
  defaultValue?: BotResponseText;
}

export interface ResponseInputRef {
  getValue: () => BotResponseText;
}

const ResponseInput = forwardRef<ResponseInputRef, ResponseInputProps>(({ defaultValue }, ref) => {
  const textareaRef: RefObject<any> = useRef(null);

  useImperativeHandle(ref, () => ({
    getValue: () => ({
      content: textareaRef.current?._innerValue || defaultValue?.content || '',
      id: defaultValue?.id,
    }),
  }));

  return (
    <Textarea
      defaultValue={defaultValue?.content}
      ref={textareaRef}
      placeholder="Enter bot response"
    />
  );
});

ResponseInput.displayName = 'ResponseInput';

export default ResponseInput;
