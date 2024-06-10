import { Router } from 'express';
import { CategoryController } from './controller';
import { CategoryService } from '../services/category.service';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { CategoriesMiddlewares } from '../middlewares/categories.middlewares';

export class CategoryRoutes {
    static get routes(): Router {
        const router = Router();

        const categoryService = new CategoryService();

        const controller = new CategoryController(categoryService);

        router.post("/", controller.createCategory);
        router.get("/:accountId", controller.getCategories);
        router.put("/", controller.updateCategory);
        router.delete("/", controller.deleteCategory);

        return router;
    }
}