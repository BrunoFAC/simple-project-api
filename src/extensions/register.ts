import dataContext from 'database';
import { ErrorsEnum } from 'enums/ErrorsEnum';
import { RegisterRequest } from 'interfaces/requests/register';
import { emailRegex, passwordRegex, usernameRegex } from 'regex';
import { Op } from 'sequelize';

type ValidateRegisterDto = {
    email: string;
    username: string;
    password: string;
};

export const validateRegister = async ({
    username,
    email,
    password,
}: RegisterRequest): Promise<{
    error?: ErrorsEnum;
    data?: ValidateRegisterDto;
}> => {
    const normalizedEmail = email?.trim()?.toLowerCase();
    const normalizedUsername = username?.trim()?.toLowerCase();
    const normalizedPassword = password?.trim();

    if (!normalizedEmail || !normalizedUsername || !normalizedPassword) {
        console.error('Missing data:', { normalizedEmail, normalizedUsername });
        return { error: ErrorsEnum.MissingData };
    }

    if (!usernameRegex.test(normalizedUsername)) {
        console.error('Invalid username:', { normalizedUsername });
        return { error: ErrorsEnum.InvalidUsername };
    }

    if (!emailRegex.test(normalizedEmail)) {
        console.error('Invalid email:', { normalizedEmail });
        return { error: ErrorsEnum.InvalidEmail };
    }

    if (!passwordRegex.test(normalizedPassword)) {
        console.error('Invalid password');
        return { error: ErrorsEnum.InvalidPassword };
    }

    try {
        const account = await dataContext.Account.findOne({
            attributes: ['Email', 'Username'],
            raw: true,
            where: {
                [Op.or]: [
                    { Email: normalizedEmail },
                    { Username: normalizedUsername },
                ],
            },
        });

        if (account) {
            if (account.Email === normalizedEmail)
                return { error: ErrorsEnum.AccountFoundEmail };
            return { error: ErrorsEnum.AccountFoundUsername };
        }

        return {
            data: {
                email: normalizedEmail,
                password: normalizedPassword,
                username: normalizedUsername,
            },
        };
    } catch (err) {
        console.error('Sequelize error in validateRegister:', { err });
        return { error: ErrorsEnum.InternalServerError };
    }
};
