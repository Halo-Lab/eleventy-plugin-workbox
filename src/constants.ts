export const PLUGIN_NAME = 'Workbox';

/** List of image formats. */
const IMAGE_FORMATS = [
  'jpg',
  'png',
  'gif',
  'ico',
  'svg',
  'jpeg',
  'avif',
  'webp',
];
/** List of font formats. */
const FONT_FORMATS = ['eot', 'ttf', 'otf', 'ttc', 'woff', 'woff2'];

/** List of dynamic assets. */
export const DYNAMIC_FORMATS = ['js', 'css', 'mjs', 'html', 'json'];

/** List of static assets. */
export const STATIC_FORMATS = FONT_FORMATS.concat(IMAGE_FORMATS);

/** List of extensions that must be cached by service worker. */
export const EXTENSIONS = DYNAMIC_FORMATS.concat(STATIC_FORMATS);

export const ONE_MEGABYTE_IN_BYTES = 1048576;
