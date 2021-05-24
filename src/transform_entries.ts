import { ManifestTransform } from 'workbox-build';

import { makeRootUrl } from './url';

export const makeManifestURlsAbsolute: ManifestTransform = async (
  manifestEntries
) => ({
  warnings: [],
  manifest: manifestEntries.map((entry) => ({
    ...entry,
    url: makeRootUrl(entry.url),
  })),
});
