import { sep, dirname } from 'path';

/** Gets _output_ directory name. */
export const getBuildDirectory = (url: string) => dirname(url).split(sep)[0];
