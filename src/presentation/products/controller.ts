import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services/category.service";
import { CategoryDto } from "../../domain/dtos/category/category.dto";
import { ProductService } from "../services/product.service";


export class ProductController {

    //inyección de dependencias
    constructor(public readonly productService: ProductService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        };
        console.log("Error", `${error}`);
        throw res.status(500).json({ error: "Internal Server Error" });
    }

    createProduct = (req: Request, res: Response) => {
        const body = req.body;
        const [error, categoryDto] = CategoryDto.create(body)
        // if (error) return res.status(400).json(error)

        // this.categoryService.createCategory(categoryDto!).then((user) => res.json(user)).catch(error => this.handleError(error, res));
    }

    getProduct = (req: Request, res: Response) => {
        // const { accountId, page = 1, pageSize = 10 } = req.body;
        // if(!accountId) return res.status(400).json({ error: "AccountId requerido" })
        // const [error, paginationDto] = PaginationDto.createPagination(page, pageSize);
        // if (error) return res.status(400).json({ error })

        // this.categoryService.getCategories(accountId, paginationDto!).then((categories) => res.json(categories)).catch(error => this.handleError(error, res));
    }

    deleteProduct = (req: Request, res: Response) => {

    }

    updateProduct = (req: Request, res: Response) => {

    }



}