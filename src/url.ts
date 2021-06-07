import { URL_DELIMITER } from './constants';

export const makeRootUrl = (url: string): string =>
  url.startsWith(URL_DELIMITER) ? url : URL_DELIMITER + url;

export const joinUrlParts = (...parts: ReadonlyArray<string>): string =>
  parts
    .map((part) =>
      part.endsWith(URL_DELIMITER) ? part.slice(0, part.length - 1) : part
    )
    .join(URL_DELIMITER);
