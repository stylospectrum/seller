type AnyObject = Record<string, any>;
type ConvertFunction = (key: string) => string;

const _processKeys = (convert: ConvertFunction, obj: AnyObject): any => {
  if (typeof obj !== 'object' || obj === null) return obj;

  let output: any;
  let i = 0;
  let l = 0;

  if (Array.isArray(obj)) {
    output = [];
    for (l = obj.length; i < l; i++) {
      output.push(_processKeys(convert, obj[i]));
    }
  } else {
    output = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        output[convert(key)] = _processKeys(convert, obj[key]);
      }
    }
  }
  return output;
};

const separateWords = (string: string): string => {
  return string
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
};

export const toSnakeCaseKeys = (obj: AnyObject): AnyObject => {
  return _processKeys(separateWords, obj);
};
