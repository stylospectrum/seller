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

const toCamelCase = (str: string) => {
  const s =
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
      .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

const toSnakeCase = (str: string) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
    .map((x) => x.toLowerCase())
    .join('_');

export const toSnakeCaseKeys = (obj: AnyObject): AnyObject => {
  return _processKeys(toSnakeCase, obj);
};

export const toCamelCaseKeys = (obj: AnyObject): AnyObject => {
  return _processKeys(toCamelCase, obj);
};
