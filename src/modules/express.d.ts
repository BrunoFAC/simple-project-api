import 'express';
import { Account } from 'models/Account';

declare global {
    namespace Express {
        interface Request {
            account?: Account;
            isAdmin?: boolean;
        }
    }
}
