import { isProduction } from '../src/mode';

describe('isProduction', () => {
  it('should always return boolean value', () => {
    expect(typeof isProduction()).toBe('boolean');

    process.env.NODE_ENV = undefined;

    expect(typeof isProduction()).toBe('boolean');
  });

  it('should return true if NODE_ENV equals to production', () => {
    process.env.NODE_ENV = 'production';

    expect(isProduction()).toBe(true);
  });

  it('should return false if NODE_ENV does not equal to production', () => {
    process.env.NODE_ENV = 'development';

    expect(isProduction()).toBe(false);
  });
});
