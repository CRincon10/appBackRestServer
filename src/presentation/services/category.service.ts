import { CategoryModel } from "../../data";
import { AccountModel } from "../../data/mongo/models/account.model";
import { CategoryDto, PaginationDto, UserEntity } from "../../domain";
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CustomError } from "../../domain/errors/custom.error";

export class CategoryService {

    constructor() { }

    public async createCategory(categoryDto: CategoryDto) {
        const [account, category ] = await Promise.all([
            AccountModel.findById(categoryDto.accountId),
            CategoryModel.findOne({ name: categoryDto.name, accountId: categoryDto.accountId }),
        ]);

        if (category) throw CustomError.badRequestResult("Ya existe una categoría con este nombre");
        if (!account) throw CustomError.badRequestResult("No se encontró la cuenta");

        try {
            const newCategory = new CategoryModel(categoryDto);
            await newCategory.save();
            const {userCreator, ...category} = CategoryEntity.createCategoryEntity(newCategory);
            return category;

        } catch (err) {
            throw CustomError.internalServer(`${err}`)
        }
    }

    public async getCategories(accountId: string, pagination: PaginationDto) {

        const { page, pagesize } = pagination;

        try {
            const [totalItems, categories] = await Promise.all([
                CategoryModel.countDocuments({ accountId }),
                CategoryModel.find({ accountId }).populate("userCreator")
                .skip((page-1) * pagesize)
                .limit(pagesize)
            ])
                

            if (categories.length <= 0) {
                throw CustomError.badRequestResult("No se encontraron categorías");
            }

            return {
                categories: categories.map(x => CategoryEntity.createCategoryEntity(x)),
                page,
                pagesize,
                items: categories.length,
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