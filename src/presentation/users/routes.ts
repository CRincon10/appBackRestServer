import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { UserService } from '../services/user.service';
import { UserController } from './controller';

export class UserRoutes {

    static get routes(): Router {

        const router = Router();

        const userService = new UserService();

        const controller = new UserController(userService);
        
        router.post('/', [AuthMiddleware.validateJWT], controller.createUser);
        router.post('/get-users',  controller.getUsers);
        router.put('/', controller.updateAccount);
        router.delete('/', controller.deleteAccountById);

        return router;
    }

}