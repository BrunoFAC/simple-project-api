/**
 * @typedef RegisterRequest
 * @property {string} username.required - User's username
 * @property {string} email.required - User's email
 * @property {string} password.required - User's password
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}
