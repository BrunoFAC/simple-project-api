import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

type AuthJwtPayload = jwt.JwtPayload & {
    id: number;
};

type JwtDecryptResult =
    | { ok: true; payload: AuthJwtPayload }
    | { ok: false; reason: 'TOKEN_EXPIRED' | 'INVALID_TOKEN' };

const secret = process.env.JWT_SECRET!;

const cryptoSecret = Buffer.from(process.env.CRYPTO_SECRET!, 'utf-8');
const cryptoIV = Buffer.from(process.env.CRYPTO_IV!, 'utf-8');

export function bcryptEncrypt(value: string) {
    return bcrypt.hash(value, 12);
}

export function jwtEncrypt(id: number) {
    return jwt.sign({ id, date: new Date() }, secret, { expiresIn: '30d' });
}

export function jwtDecrypt(token: string): JwtDecryptResult {
    try {
        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded !== 'object' ||
            decoded === null ||
            !('id' in decoded)
        ) {
            return { ok: false, reason: 'INVALID_TOKEN' };
        }

        return { ok: true, payload: decoded as AuthJwtPayload };
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return { ok: false, reason: 'TOKEN_EXPIRED' };
        }

        if (err instanceof JsonWebTokenError) {
            return { ok: false, reason: 'INVALID_TOKEN' };
        }

        throw err;
    }
}

export function generateNonce(length = 16): string {
    return crypto.randomBytes(length).toString('hex');
}

export function randomString(length: number, opts?: object): string {
    const defaults = {
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
    };
    const opt = { ...defaults, ...opts };
    let result = '';
    const characters =
        (opt.uppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '') +
        (opt.lowercase ? 'abcdefghijklmnopqrstuvwxyz' : '') +
        (opt.numbers ? '0123456789' : '') +
        (opt.symbols ? '[]_:;=)(/&%$#!|@£§€{}»«<>' : '');
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
}

export function generateOtp(): string {
    return randomString(6, {
        upperCaseAlphabets: true,
        specialChars: false,
        lowerCaseAlphabets: false,
        symbols: false,
    });
}

export async function bcryptIsValid(value: string, hash: string) {
    return bcrypt.compare(value, hash);
}

export function cryptoEncrypt(value: string) {
    const cipher = crypto.createCipheriv('aes256', cryptoSecret, cryptoIV);
    return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
}

export function cryptoDecrypt(value: string) {
    const cipher = crypto.createDecipheriv('aes256', cryptoSecret, cryptoIV);
    return cipher.update(value, 'hex', 'utf8') + cipher.final('utf8');
}

export default {
    jwtEncrypt,
    jwtDecrypt,
    randomString,
    bcryptEncrypt,
    bcryptIsValid,
    cryptoEncrypt,
    cryptoDecrypt,
    generateNonce,
    generateOtp,
};
