import { buildSWScriptRegistration } from '../src/injectable_script';

describe('buildSWScriptRegistration', () => {
  it('should return script tag, which injects service worker to page', () => {
    const publicUrl = 'foo/sw.js';
    const script = buildSWScriptRegistration(publicUrl);

    expect(script).toMatch(/<script>/);
    expect(script).toMatch(/\/foo\/sw\.js/);
  });
});
