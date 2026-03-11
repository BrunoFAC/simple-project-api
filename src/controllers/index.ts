import express from 'express';
import accountsRoutes from './accounts';
import loginRoutes from './login';
import registerRoutes from './register';

const router = express.Router();

router.use('/accounts', accountsRoutes);
router.use('/register', registerRoutes);
router.use('/login', loginRoutes);

export default router;
