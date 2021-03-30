# eleventy-plugin-workbox 💼

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Cache your site to stay up in offline! ✊

## Intention

This plugin aims to be as configurable as you want and has ability to inject service worker registration script into HTML.

## Get started

> **Warning**: plugin uses [build events](https://www.11ty.dev/docs/events/#afterbuild) that are available in Eleventy from `0.11.1` version. So versions below are not supported!

### Installation

At first do:

```sh
npm i -D eleventy-plugin-workbox
```

And then add plugin to _eleventyConfig_ object in `.eleventy.js`.

```js
const { cache } = require('eleventy-plugin-workbox');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(cache, {
    /* Options are optional. */
  });
};
```

### Options

Plugin can accept options:

```ts
interface EleventyPluginWorkboxOptions {
  /**
   * Options that will be passed to
   * [`generateSW` function](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW).
   */
  generateSWOptions?: GenerateSWConfig;
  /**
   * Tells where relative to _dir.output_ directory
   * service worker file must be placed.
   */
  serviceWorkerDirectory?: string;
  /**
   * Name of the Eleventy's _build_ directory. Must
   * be the same value as _dir.output_. By default,
   * it is `_site`.
   */
  buildDirectory?: string;
  /**
   * Tells if plugin should generate service worker.
   * Useful for situations when there is a need to test service worker,
   * especially in development process.
   *
   * By default it is enabled if `NODE_ENV === 'production'`.
   */
  enabled?: boolean;
}
```

### What's special?

1. This plugin uses [`workbox`](https://developers.google.com/web/tools/workbox/) to cache assets.

2. It differentiates between _static_(images and fonts) and _dynamic_(JavaScript, CSS, HTML, JSON) assets. They are treated differently:

   - for _static_ assets plugin uses [`StaleWhileRevalidate`](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies#stalewhilerevalidate) due to assumption that such resources are changed rarely.
   - for _dynamic_ assets plugin uses [`NetworkFirst`](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies#networkfirst) strategy, because this resources may change frequently.

   > This is a default behavior and can be easily changed.

3. It automatically injects service worker registration script into each generated HTML, so you must not do it manually. Perfect 😀!

> Note: if you will also use [`afterBuild` event](https://www.11ty.dev/docs/events/#afterbuild) to write some logic, be sure that your plugin is added before this plugin. Otherwise there may be inconsistencies in cached resources, if your plugin somehow changes them.

## Word from author

Have fun! ✌️
