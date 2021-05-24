import { join } from 'path';

import { generateSW, GenerateSWConfig } from 'workbox-build';

import { toMegabytes } from './to_megabytes';
import { joinUrlParts } from './url';
import { isProduction } from './mode';
import { getBuildDirectory } from './path_stats';
import { done, oops, start } from './pretty';
import { makeManifestURlsAbsolute } from './transform_entries';
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
   * Directory inside _output_ folder to be used as place for
   * service worker.
   */
  publicDirectory?: string;
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
    publicDirectory = '',
    generateSWOptions,
  }: EleventyPluginWorkboxOptions = {}
) => {
  if (enabled) {
    const serviceWorkerPublicUrl = joinUrlParts(
      publicDirectory,
      'service-worker.js'
    );

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
      Promise.resolve(start('Generation of service worker was started.'))
        .then(() =>
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
            manifestTransforms: [makeManifestURlsAbsolute],
            ...(generateSWOptions ?? {}),
          })
        )
        .then(
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
