import { join } from 'path';

import chalk from 'chalk';
import { generateSW, GenerateSWConfig } from 'workbox-build';

import { toMegabytes } from './to_megabytes';
import { isProduction } from './mode';
import { done, oops, warn } from './pretty';
import { getBuildDirectory } from './path_stats';
import { buildSWScriptRegistration } from './injectable_script';
import {
  EXTENSIONS,
  PLUGIN_NAME,
  STATIC_FORMATS,
  DYNAMIC_FORMATS,
} from './constants';

export interface EleventyPluginWorkboxOptions {
  /**
   * Options that will be passed to
   * [`generateSW` function](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW).
   */
  generateSWOptions?: GenerateSWConfig;
  /**
   * Tells where relative to _dir.output_ directory
   * service worker file must be placed.
   *
   * @deprecated in favour of _publicDirectory_.
   */
  serviceWorkerDirectory?: string;
  /**
   * Directory inside _output_ folder to be used as place for
   * service worker.
   */
  publicDirectory?: string;
  /**
   * Name of the Eleventy's _build_ directory. Must
   * be the same value as _dir.output_. By default,
   * it is `_site`.
   *
   * @deprecated - plugin will detect _output_ directory
   * by itself.
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

/**
 * Generate service worker for caching project's files.
 * In _build_ directory will be generated one file for this.
 * Script for registering generated service worker will be
 * automatically included into HTML.
 *
 * Note that if you set listeners to `afterBuild` event
 * in your Eleventy build pipeline, then this plugin should
 * be the last one.
 */
export const cache = (
  /** Eleventy config object. */
  config: Record<string, Function>,
  {
    enabled = isProduction(),
    // TODO: remove in next minor release.
    buildDirectory,
    publicDirectory = '',
    generateSWOptions,
    // TODO: remove in next minor release.
    serviceWorkerDirectory = '',
  }: EleventyPluginWorkboxOptions = {}
) => {
  if (enabled) {
    if (serviceWorkerDirectory.length > 0) {
      warn(
        `${chalk.bold(
          'serviceWorkerDirectory'
        )} option is deprecated and will be removed. Please use ${chalk.bold(
          'publicDirectory'
        )} instead.`
      );
    }

    if (buildDirectory !== undefined) {
      warn(
        `${chalk.bold(
          'buildDirectory'
        )} option is deprecated, has not impact on plugin and will be removed.`
      );
    }

    const serviceWorkerPublicUrl = join(publicDirectory, 'service-worker.js');

    // Holds name of output directory.
    let outputDirectory: string;

    config.addTransform(
      'service-worker',
      (content: string, outputPath: string) => {
        outputDirectory ??= getBuildDirectory(outputPath);

        if (outputPath.endsWith('html')) {
          const htmlWithServiceWorker = content.replace(
            '</head>',
            buildSWScriptRegistration(serviceWorkerPublicUrl) + '</head>'
          );

          done('Service worker registration script is injected into HTML');

          return htmlWithServiceWorker;
        }

        return content;
      }
    );

    config.on('afterBuild', () =>
      generateSW({
        cacheId: 'EleventyPlugin' + PLUGIN_NAME,
        swDest: join(outputDirectory, serviceWorkerPublicUrl),
        sourcemap: !isProduction(),
        skipWaiting: true,
        globPatterns: [`**/*.{${EXTENSIONS}}`],
        clientsClaim: true,
        globDirectory: outputDirectory,
        inlineWorkboxRuntime: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            handler: 'NetworkFirst',
            urlPattern: new RegExp(`.+\\.(${DYNAMIC_FORMATS.join('|')})$`),
          },
          {
            handler: 'StaleWhileRevalidate',
            urlPattern: new RegExp(`.+\\.(${STATIC_FORMATS.join('|')}})$`),
          },
        ],
        ...(generateSWOptions ?? {}),
      }).then(
        ({ size, count }) =>
          done(
            `${count} files will be precached, totaling ${toMegabytes(
              size
            )} MB.`
          ),
        oops
      )
    );
  }
};
