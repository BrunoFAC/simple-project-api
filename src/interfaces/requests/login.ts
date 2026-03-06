/**
 * @typedef LoginRequest
 * @property {string} email.required - User's email
 * @property {string} password.required - User's password
 */
export interface LoginRequest {
    email: string;
    password: string;
}
