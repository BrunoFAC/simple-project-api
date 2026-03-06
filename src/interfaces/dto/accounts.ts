import { AccountRoleEnum } from 'enums/AccountRoleEnum';

/**
 * @typedef AccountListDTO
 * @property {number} id.required
 * @property {string} email.required
 * @property {string} name.required
 * @property {number} role.required
 * @property {Date} creationDate.required
 */
export interface AccountListDTO {
    id: number;
    email: string;
    username: string;
    role: AccountRoleEnum;
    creationDate?: Date;
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
 * @typedef AccountDTO
 * @property {number} id.required
 * @property {string} name.required
 */
export interface AccountDTO {
    id: number;
    name: string;
}
