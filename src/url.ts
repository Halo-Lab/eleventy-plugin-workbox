const URL_DELIMETER = '/';

export const makeRootUrl = (url: string): string =>
  url.startsWith(URL_DELIMETER) ? url : URL_DELIMETER + url;

export const joinUrlParts = (...parts: ReadonlyArray<string>): string =>
  parts.join(URL_DELIMETER);
