import dataContext from 'database';
import { AccountRoleEnum } from 'enums/AccountRoleEnum';
import { StatusCodeEnum } from 'enums/StatusCodeEnum';
import encryptor from 'services/encryptor';

export async function Authenticated(req: any, res: any, next: any) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(StatusCodeEnum.Unauthorized).send();
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(StatusCodeEnum.Unauthorized).send();
    }

    const result = encryptor.jwtDecrypt(token);

    if (!result.ok) {
        return res.status(StatusCodeEnum.Unauthorized).send();
    }

    const account = await dataContext.Account.findOne({
        where: { Id: result.payload.id, IsDeleted: 0 },
    });

    if (!account) {
        return res.status(StatusCodeEnum.Unauthorized).send();
    }

    req.account = account;
    req.isAdmin = account.Role === AccountRoleEnum.Admin;

    next();
}

/**
 * OptionalAuthenticated middleware
 * Tries to authenticate the user via JWT, but does NOT block requests if it fails.
 *
 * - If a valid JWT is provided:
 *     - req.account, req.isAdmin, req.isJudge are populated
 * - If the JWT is missing or invalid:
 *     - request continues anonymously (req.account = null)
 *
 * Use this for routes that are public but may reveal additional
 * information or behavior depending on the authenticated user.
 */
export async function OptionalAuthenticated(req: any, res: any, next: any) {
    const { authorization } = req.headers;

    req.account = null;
    req.isAdmin = false;

    if (!authorization) {
        return next();
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next();
    }

    const result = encryptor.jwtDecrypt(token);

    if (!result.ok) {
        return next();
    }

    const account = await dataContext.Account.findOne({
        where: { Id: result.payload.id, IsDeleted: 0 },
    });

    if (!account) {
        return next();
    }

    req.account = account;
    req.isAdmin = account.Role === AccountRoleEnum.Admin;

    next();
}
