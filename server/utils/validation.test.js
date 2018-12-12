const expect = require('expect');

const { 
  isRealString
} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const response = isRealString(25);
    expect(response).toBe(false);
  });

  it('should reject string with only spaces', () => {
    const response = isRealString('   ');
    expect(response).toBe(false);
  });

  it('should allow strings with non-spaces characters', () => {
    const response = isRealString(' Spongebob Squarepants ');
    expect(response).toBe(true);
  });
});