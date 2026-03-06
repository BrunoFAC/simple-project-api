import { ethers } from 'ethers';

export const isNotUndefined = (value: any) => value !== undefined;

export const parseBool = (v: any): boolean => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v.toLowerCase() === 'true';
    if (typeof v === 'number') return v === 1;
    return false;
};

export const invalidString = (value: any) =>
    isNotUndefined(value) &&
    (typeof value !== 'string' || value?.trim().length === 0);

export const invalidAmount = (value: any) =>
    isNotUndefined(value) &&
    (Number.isNaN(Number(value)) || Number(value) <= 0);

export const sanitizeAddress = (raw: unknown): string => {
    return String(raw)
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
};

export const isValidWallet = (addr?: string): boolean =>
    typeof addr === 'string' && ethers.isAddress(addr);
