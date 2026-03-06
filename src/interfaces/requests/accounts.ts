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
