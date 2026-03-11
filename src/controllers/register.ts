import dataContext from 'database';
import { AccountRoleEnum } from 'enums/AccountRoleEnum';
import { StatusCodeEnum } from 'enums/StatusCodeEnum';
import express from 'express';
import { validateRegister } from 'extensions/register';
import { RegisterRequest } from 'interfaces/requests/register';
import encryptor from 'services/encryptor';

const routes = express.Router();

/**
 * Register
 * @route POST /register
 * @group Register - Operations about registering the user.
 * @param {RegisterRequest.model} data.body.required
 * @returns 200
 * @returns 400
 * @returns 500 - An error has occurred
 */
routes.post('/', async (req, res) => {
    const { username, email, password } = req.body as RegisterRequest;

    const { data, error } = await validateRegister({
        username,
        email,
        password,
    });

    if (!data || error) {
        res.status(StatusCodeEnum.BadRequest).send({ error });
        return;
    }
    const passwordHashed = await encryptor.bcryptEncrypt(data.password);

    try {
        await dataContext.Account.create({
            Email: data.email,
            Username: data.username,
            Password: passwordHashed,
            Role: AccountRoleEnum.Member,
        });
        res.status(StatusCodeEnum.Created).send();
    } catch (err) {
        console.error('/register > Error creating new account:', { err });
        res.status(StatusCodeEnum.InternalServerError).send();
    }
});

export default routes;
