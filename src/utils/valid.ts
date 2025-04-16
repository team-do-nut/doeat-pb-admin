/* eslint-disable no-redeclare */
export function isValidEmpty(value: string): boolean;
export function isValidEmpty(value: string[]): boolean;
export function isValidEmpty(value: string | string[]): boolean {
  if (Array.isArray(value)) {
    return value.every((item) => item !== '');
  }
  return value !== '';
}

export function isValidNumber(value: string) {
  return !Number.isNaN(Number(value));
}
