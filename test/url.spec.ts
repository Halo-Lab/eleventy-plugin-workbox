import { joinUrlParts, makeRootUrl } from '../src/url';

describe('makeRootUrl', () => {
  it('should add leading slash to url if has not any', () => {
    expect(makeRootUrl('foo')).toMatch(/\/foo/);
  });

  it('should not touch url if it already has leading slash', () => {
    expect(makeRootUrl('/foo')).toMatch(/\/foo/);
  });
});

describe('joinUrlParts', () => {
  it('should join parts of url', () => {
    expect(joinUrlParts('foo', 'baz')).toMatch('foo/baz');
  });
});
