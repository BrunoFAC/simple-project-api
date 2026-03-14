import { AccountRoleEnum } from 'enums/AccountRoleEnum';

/**
 * @typedef AccountListDTO
 * @property {number} id.required
 * @property {string} email.required
 * @property {string} username.required
 * @property {number} role.required
 * @property {Date} creationDate.required
 * @property {Date} updateDate.required
 */
export interface AccountListDTO {
    id: number;
    email: string;
    username: string;
    role: AccountRoleEnum;
    creationDate?: Date;
    updateDate?: Date;
}

/**
 * @typedef TableResultAccountsListDTO
 * @property {AccountListDTO[]} results
 * @property {number} count
 */
export interface TableResultAccountsListDTO {
    results: AccountListDTO[];
    count: number;
}

/**
 * @typedef AccountSummaryDTO
 * @property {number} id.required
 * @property {string} email.required
 * @property {string} name.required
 * @property {number} role.required
 */
export interface AccountSummaryDTO {
    id: number;
    email: string;
    name: string;
    role: number;
}

/**
 * @typedef AccountUpdateRoleDTO
 * @property {number} id.required
 * @property {string} email.required
 * @property {number} role.required
 * @property {string} username.required
 */
export interface AccountUpdateRoleDTO {
    id: number;
    email: string;
    username: string;
    role: AccountRoleEnum;
}
