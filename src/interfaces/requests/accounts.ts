import { AccountRoleEnum } from 'enums/AccountRoleEnum';

/**
 * @typedef AccountsQuery
 * @property {number} top
 * @property {number} skip
 * @property {string} search
 */
export interface AccountsQuery {
    top?: string;
    skip?: string;
    search?: string;
}

/**
 * @typedef AccountUpdateRoleRequest
 * @property {number} role.required
 */
export interface AccountUpdateRoleRequest {
    role: AccountRoleEnum;
}
