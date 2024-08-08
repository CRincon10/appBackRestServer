import { Router } from 'express';
import { AuthController } from './controller';
import { envs } from '../../config/envs';
import { EmailService, AuthService } from '../services';
import { DiscordService } from '../services/discord.service';

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
        const discordService = new DiscordService();

        const controller = new AuthController(authService, discordService);
        // Definir las rutas
        router.post('/register', controller.registerUser );
        router.post('/login', controller.loginUser );
        router.post('/login/social', controller.socialLogin );
        router.use('/validate-email/:token', controller.validateEmailUser );
        return router;
    }

}