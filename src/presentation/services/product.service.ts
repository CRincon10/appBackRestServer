import { ProductModel } from "../../data";
import { AccountModel } from "../../data/mongo/models/account.model";
import { CustomError, PaginationDto } from "../../domain";

export class ProductService {

    constructor() { }

    public async createProduct(productDto: any) {
        const [account, product ] = await Promise.all([
            AccountModel.findById(productDto.accountId).catch(error => {throw CustomError.badRequestResult("No se encontró la cuenta")}),
            ProductModel.findOne({ name: productDto.name, accountId: productDto.accountId }),
        ]);

        if (product) throw CustomError.badRequestResult("Ya existe una categoría con este nombre");
        if (!account) throw CustomError.badRequestResult("No se encontró la cuenta");

        try {
            const newProduct = new ProductModel(productDto);
            newProduct.dateCreated = new Date();
            await newProduct.save();
            return newProduct;

        } catch (err) {
            throw CustomError.internalServer(`${err}`)
        }
    }

    public async getProducts(accountId: string, pagination: PaginationDto) {

        const { page, pagesize } = pagination;

        try {
            const [totalItems, products] = await Promise.all([
                ProductModel.countDocuments({ accountId }),
                ProductModel.find({ accountId }).populate("userCreator")
                .skip((page-1) * pagesize)
                .limit(pagesize)
            ])
                

            if (products.length <= 0) {
                throw CustomError.badRequestResult("No se encontraron categorías");
            }

            return {
                products,
                page,
                pagesize,
                items: products.length,
                totalItems,
                nextPage: page * pagesize < totalItems ? page + 1 : null,
                prevPage: page - 1 > 0 ? page - 1 : null
            }

        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        }
    }


}