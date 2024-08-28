import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { UserService } from '../services/user.service';
import { UserController } from './controller';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services';
import { envs } from '../../config';

export class UserRoutes {

    static get routes(): Router {

        const router = Router();
        const emailService = new EmailService(
            envs.MAILER_SERVICE, 
            envs.MAILER_EMAIL, 
            envs.MAILER_SECRET_KEY, 
            envs.SEND_EMAIL
        );
        
        const userService = new UserService(emailService);
        const controller = new UserController(userService);
        
        // router.post('/', [AuthMiddleware.validateJWT], controller.createUser);  Verificar si quiero que todas las rutas pasen por el middleware de validacion de usuario
        router.post('/', controller.createUser);
        router.get('/get-userById/:userId', controller.getUserById)
        router.post('/get-users',  controller.getUsers);
        router.post('/change-status', controller.changeStatusById);
        router.put('/', controller.updateUser);

        return router;
    }

}