import { Router } from 'express';
import { CategoryService } from '../services/category.service';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { ProductController } from './controller';
import { ProductService } from '../services/product.service';

export class ProductRoutes {

    static get routes(): Router {

        const router = Router();


        const productService = new ProductService();

        const controller = new ProductController(productService);

        router.post('/', [AuthMiddleware.validateJWT], controller.createProduct);
        router.post('/', [AuthMiddleware.validateJWT], controller.getProduct);
        router.put('/', controller.updateProduct);
        router.delete('/', controller.deleteProduct);

        return router;
    }

}