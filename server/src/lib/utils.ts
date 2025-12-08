import crypto from 'crypto';

export const generateSecureNumber = (digit: number) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit;

  return crypto.randomInt(min, max);
}