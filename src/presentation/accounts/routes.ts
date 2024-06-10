import { Router } from 'express';
import { AccountService } from '../services/account.service';
import { AccountsController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middlewares';

export class AccountRoutes {

    static get routes(): Router {

        const router = Router();


        const accountService = new AccountService();

        const controller = new AccountsController(accountService);
        // Definir las rutas
        router.post('/', [AuthMiddleware.validateJWT], controller.createAccount);
        router.get('/get-accounts/:userId?',  controller.getAccounts);
        router.put('/', controller.updateAccount);
        router.post('/change-status', controller.changeStatusAccount);

        return router;
    }

}