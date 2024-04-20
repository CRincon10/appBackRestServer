import { Router } from 'express';
import { AuthController } from './controller';
import { envs } from '../../config/envs';
import { EmailService, AuthService } from '../services';

export class AuthRoutes {

    static get routes(): Router {

        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE, 
            envs.MAILER_EMAIL, 
            envs.MAILER_SECRET_KEY, 
            envs.SEND_EMAIL
        );

        const authService = new AuthService(emailService);

        const controller = new AuthController(authService);
        // Definir las rutas
        router.use('/register', controller.registerUser );
        router.use('/login', controller.loginUser );
        router.use('/validate-email/:token', controller.validateEmailUser );
        return router;
    }

}