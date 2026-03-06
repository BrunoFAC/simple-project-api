import { StatusCodeEnum } from 'enums/StatusCodeEnum';
import express from 'express';
import { validateLogin } from 'extensions/login';
import { LoginDTO } from 'interfaces/dto/login';
import { LoginRequest } from 'interfaces/requests/login';
import encryptor from 'services/encryptor';

const routes = express.Router();

/**
 * Login
 * @route POST /login
 * @group Login - Operations about login
 * @param {LoginRequest.model} data.body.required
 * @returns {LoginDTO.model} 200
 * @returns 400
 * @returns 401 - Wrong password
 * @returns 500 - An error has occurred
 */
routes.post('/', async (req, res) => {
    const { email, password } = req.body as LoginRequest;

    const { error, accountId } = await validateLogin({ email, password });

    if (error) {
        res.status(StatusCodeEnum.BadRequest).send({ error });
        return;
    }

    const token = encryptor.jwtEncrypt(accountId);

    const result: LoginDTO = { token };

    res.status(StatusCodeEnum.OK).send(result);
});

export default routes;
