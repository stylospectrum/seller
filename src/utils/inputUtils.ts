export function findIndexOfCurrentWord(textareaNode: HTMLTextAreaElement) {
  const currentValue = textareaNode.value;
  const cursorPos = textareaNode.selectionStart;

  let startIndex = cursorPos - 1;
  while (startIndex >= 0 && !/\s/.test(currentValue[startIndex])) {
    startIndex--;
  }
  return startIndex;
}

export function replaceCurrentWord(newWord: string, textareaNode: HTMLTextAreaElement) {
  const currentValue = textareaNode.value;
  const cursorPos = textareaNode.selectionStart;
  const startIndex = findIndexOfCurrentWord(textareaNode);

  const newValue =
    currentValue.substring(0, startIndex + 1) + newWord + currentValue.substring(cursorPos);
  textareaNode.value = newValue;
  textareaNode.focus();
  textareaNode.selectionStart = textareaNode.selectionEnd = startIndex + 1 + newWord.length;
}

export function replaceHighlightedText(newWord: string, textareaNode: HTMLTextAreaElement) {
  const selectionStart = textareaNode!.selectionStart;
  const selectionEnd = textareaNode!.selectionEnd;
  const textBeforeSelection = textareaNode!.value.substring(0, selectionStart);
  const textAfterSelection = textareaNode!.value.substring(selectionEnd);

  textareaNode!.value = textBeforeSelection + newWord + textAfterSelection;
  textareaNode!.selectionStart = selectionStart;
  textareaNode!.selectionEnd = selectionStart + newWord.length;
}

export function createCaret(
  textareaNode: HTMLTextAreaElement,
  callback: (pre: Text, caret: HTMLElement, post: Text) => void,
) {
  textareaNode.focus();
  const currentValue = textareaNode.value;
  const cursorPos = textareaNode.selectionStart;

  const textBeforeCursor = currentValue.substring(0, cursorPos);
  const textAfterCursor = currentValue.substring(cursorPos);

  const pre = document.createTextNode(textBeforeCursor);
  const post = document.createTextNode(textAfterCursor);
  const caretEle = document.createElement('span');
  caretEle.innerHTML = '&nbsp;';

  callback(pre, caretEle, post);
}

export function highlightText(textareaNode: HTMLTextAreaElement, callback: Function) {
  const text = textareaNode.value;
  const cursorPosition = textareaNode.selectionStart;
  const startIndex = text.lastIndexOf('$', cursorPosition - 1);

  if (startIndex !== -1 && cursorPosition > startIndex) {
    let endIndex = text.indexOf(' ', startIndex);

    if (endIndex === -1) {
      endIndex = text.length;
    }

    const withinWord = cursorPosition >= startIndex && cursorPosition <= endIndex;

    if (withinWord) {
      textareaNode.setSelectionRange(startIndex, endIndex);
      callback();
    }
  }
}
