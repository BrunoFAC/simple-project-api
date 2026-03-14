import dataContext from 'database';
import { StatusCodeEnum } from 'enums/StatusCodeEnum';
import express from 'express';
import { validateAccountUpdateRole } from 'extensions/account';
import fs from 'fs';
import {
    AccountSummaryDTO,
    AccountUpdateRoleDTO,
    TableResultAccountsListDTO,
} from 'interfaces/dto/accounts';
import {
    AccountsQuery,
    AccountUpdateRoleRequest,
} from 'interfaces/requests/accounts';
import { IsAdmin } from 'middlewares/admin';
import { Authenticated } from 'middlewares/authentication';
import { Account, AccountAttributes } from 'models/Account';
import multer from 'multer';
import { Op, WhereOptions } from 'sequelize';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        // Name of the folder
        const path = './uploads/accounts';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename(req, file, cb) {
        const extension = file.originalname.match(/[\w]+$/)![0];
        cb(null, `${Date.now()}.${extension}`);
    },
});

const upload = multer({ storage });

const routes = express.Router();

/**
 * Get logged in user info
 * @route GET /accounts/summary
 * @group Accounts - Operations about accounts
 * @returns {AccountSummaryDTO.model} 200
 * @returns 401 - User is not logged in
 * @returns 500 - An error has occurred
 * @security JWT
 */
routes.get('/summary', Authenticated, async (req, res) => {
    const { account } = req;

    const result: AccountSummaryDTO = {
        id: account!.Id,
        email: account!.Email,
        name: account!.Username,
        role: account!.Role,
    };

    res.status(StatusCodeEnum.OK).send(result);
});

/**
 * Get users list
 * @route GET /accounts
 * @group Accounts - Operations about accounts
 * @param {number} top.query default - 10
 * @param {number} skip.query default - 0
 * @returns {TableResultAccountsListDTO.model} 200
 * @returns 401 - User is not logged in
 * @returns 403 - User doesn't have permissions to make this action
 * @returns 500 - An error has occurred
 * @security JWT
 */
routes.get('/', Authenticated, IsAdmin, async (req, res) => {
    const { top, skip, search } = req.query as AccountsQuery;

    const resolvedTop = Number(top) || 10;
    const resolvedSkip = Number(skip) || 0;
    const resolvedSearch = search ? search.toLowerCase() : undefined;

    const where: WhereOptions<AccountAttributes> = {};

    if (resolvedSearch) where.Username = { [Op.like]: `%${resolvedSearch}%` };

    const accounts = await dataContext.Account.findAndCountAll({
        where,
        order: [['id', 'asc']],
        limit: resolvedTop,
        offset: resolvedSkip,
    });

    const result: TableResultAccountsListDTO = {
        count: accounts.count,
        results: accounts.rows.map(account => ({
            id: account.Id,
            email: account.Email,
            username: account.Username,
            role: account.Role,
            creationDate: account.CreatedAt,
            updateDate: account.UpdatedAt ?? account.CreatedAt,
        })),
    };

    res.status(StatusCodeEnum.OK).send(result);
});

/**
 * Upload user avatar
 * @route PATCH /accounts/avatar
 * @group Accounts - Operations about accounts
 * @consumes multipart/form-data
 * @param {file} avatar.formData - The file to upload
 * @returns 200
 * @returns 400
 * @returns 401 - User is not logged in
 * @returns 500 - An error has occurred
 * @security JWT
 */
routes.patch(
    '/avatar',
    Authenticated,
    upload.single('avatar'),
    async (req, res) => {
        const { file, account } = req;

        const dbFile = await dataContext.File.create({
            FileName: file!.originalname,
            FilePath: file!.path,
            IsDeleted: 0,
            UploadedById: account!.Id,
            FileSize: file!.size,
        });

        await account!.update({ ProfileFileId: dbFile.Id });

        res.status(StatusCodeEnum.OK).send();
    },
);

/**
 * Update account role
 * @route PATCH /accounts/:accountId/role
 * @group Accounts - Operations about accounts
 * @param {AccountUpdateRoleRequest.model} data.body.required
 * @returns {AccountUpdateRoleDTO.model} 200
 * @returns 400
 * @returns 401 - User is not logged in
 * @returns 403 - User doesn't have permissions to make this action
 * @returns 500 - An error has occurred
 * @security JWT
 */
routes.patch('/:accountId/role', Authenticated, IsAdmin, async (req, res) => {
    const loggedInAccount = req.account as Account;
    const accountId = Number(req.params.accountId);
    const { role } = req.body as AccountUpdateRoleRequest;

    const { error, account } = await validateAccountUpdateRole({
        accountId,
        role,
        loggedInAccount,
    });

    if (error || !account)
        return res.status(StatusCodeEnum.BadRequest).send({ error });

    await account.update({ Role: role });

    const result: AccountUpdateRoleDTO = {
        id: account.Id,
        email: account.Email,
        username: account.Username,
        role: account.Role,
    };

    return res.status(StatusCodeEnum.OK).send(result);
});

export default routes;
