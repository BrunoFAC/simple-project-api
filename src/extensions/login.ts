import dataContext from 'database';
import { ErrorsEnum } from 'enums/ErrorsEnum';
import { LoginRequest } from 'interfaces/requests/login';
import encryptor from 'services/encryptor';

export const validateLogin = async ({
    email,
    password,
}: LoginRequest): Promise<{ error?: ErrorsEnum; accountId: number }> => {
    if (!email || !password)
        return { error: ErrorsEnum.MissingData, accountId: 0 };

    const account = await dataContext.Account.findOne({
        where: { Email: email, IsDeleted: 0 },
    });

    if (!account)
        return { error: ErrorsEnum.AccountNotFoundEmail, accountId: 0 };

    if (account.FailedPasswordAttempts >= 5)
        return { error: ErrorsEnum.UserLocked, accountId: 0 };

    const passwordIsValid = await encryptor.bcryptIsValid(
        password,
        account.Password,
    );

    if (!passwordIsValid) {
        await account.update({
            FailedPasswordAttempts: account.FailedPasswordAttempts + 1,
        });

        return { error: ErrorsEnum.WrongCredentials, accountId: 0 };
    }

    await account.update({ FailedPasswordAttempts: 0 });

    return { accountId: account.Id };
};
