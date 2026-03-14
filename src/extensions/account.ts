import dataContext from 'database';
import { AccountRoleEnum } from 'enums/AccountRoleEnum';
import { ErrorsEnum } from 'enums/ErrorsEnum';
import { AccountUpdateRoleRequest } from 'interfaces/requests/accounts';
import { Account } from 'models/Account';

export async function validateAccountUpdateRole({
    accountId,
    role,
    loggedInAccount,
}: AccountUpdateRoleRequest & {
    accountId: number;
    loggedInAccount: Account;
}): Promise<{
    error?: ErrorsEnum;
    account?: Account;
}> {
    if (!accountId || !role || !loggedInAccount.Id)
        return { error: ErrorsEnum.MissingData };

    if (!Object.values(AccountRoleEnum).includes(role))
        return { error: ErrorsEnum.InvalidEnum };

    const account = await dataContext.Account.findOne({
        where: { Id: accountId, IsDeleted: 0 },
    });

    if (!account) return { error: ErrorsEnum.AccountNotFound };

    if (loggedInAccount.Id === account.Id)
        return { error: ErrorsEnum.InvalidData };

    return { account };
}
