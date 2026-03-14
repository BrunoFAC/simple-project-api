import { AccountRoleEnum } from 'enums/AccountRoleEnum';
import { StatusCodeEnum } from 'enums/StatusCodeEnum';
import { Account } from 'models/Account';

export function IsAdmin(req: any, res: any, next: any) {
    const account = req.account as Account;
    const isAdmin = account.Role === AccountRoleEnum.Admin;
    if (!isAdmin) return res.status(StatusCodeEnum.Forbidden).send();

    next();
}
