import { AccountRoleEnum } from 'enums/AccountRoleEnum';
import { StatusCodeEnum } from 'enums/StatusCodeEnum';

export function RequiresPermissions(...roles: AccountRoleEnum[]) {
    return (req: any, res: any, next: any) => {
        if (!roles.includes(req.account.Role))
            return res.status(StatusCodeEnum.Forbidden).send();

        return next();
    };
}
