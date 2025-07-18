import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './categories/routes';
import { AccountRoutes } from './accounts/routes';
import { ProductRoutes } from './products/routes';
import { UserRoutes } from './users/routes';

export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/categories', CategoryRoutes.routes);
        router.use('/api/accounts', AccountRoutes.routes);
        router.use('/api/products', ProductRoutes.routes);
        router.use('/api/users', UserRoutes.routes);
        
        return router;
    }

}

