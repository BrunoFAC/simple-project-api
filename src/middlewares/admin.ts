import { StatusCodeEnum } from 'enums/StatusCodeEnum';

export function IsAdmin(req: any, res: any, next: any) {
    const isAdmin = !!req.account.IsAdmin;
    if (!isAdmin) return res.status(StatusCodeEnum.Forbidden).send();

    next();
}
