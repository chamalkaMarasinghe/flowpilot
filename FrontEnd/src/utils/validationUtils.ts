export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isNonEmpty = (v: string) => v.trim().length > 0;
export const minLen = (v: string, n: number) => v.trim().length >= n;
