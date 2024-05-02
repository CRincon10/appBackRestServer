import { UserModel } from "../../data";
import { CustomError, PaginationDto, RegisterUserDto, UserEntity } from "../../domain";
import { DisabledAccountDto } from "../../domain/dtos/shared/requests/account.request.dto";
import { AccountEntity } from '../../domain/entities/account.entity';
import { validateUserAdmin } from "./helper";


export class UserService {

    constructor() { }

    public async createUser(userDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ documentIdentificationNumber: userDto.documentIdentificationType });
        if (existUser) throw CustomError.badRequestResult("Ya existe un usuario con este numero de documento");

        try {
            const newUser = new UserModel(userDto);
            newUser.dateCreated = new Date();
            await newUser.save();
            const { id, password, ...user } = UserEntity.createObjectUser(newUser);
            return user;

        } catch (err) {
            throw CustomError.internalServer(`${err}`)
        }
    }

    public async getUsers(pagination: PaginationDto, userId?: string) {
        const { page, pagesize } = pagination;

        try {
            let tasks: any[] = [
                UserModel.countDocuments(),
                UserModel.find().populate("userCreator")
                    .skip((page - 1) * pagesize)
                    .limit(pagesize),
            ];

            if (userId) tasks.push(tasks.push(UserModel.findById(userId) as unknown as Promise<Document>));

            const [totalItems, accounts, user ] = await Promise.all(tasks);

            if (accounts.length <= 0) {
                throw CustomError.badRequestResult("No se encontraron cuentas");
            }

            if (userId && !user) {
                throw CustomError.badRequestResult("Usuario no encontrado");
            } else if (userId && user) {
                const userIsAdmin = validateUserAdmin(UserEntity.createObjectUser(user));
                if (!userIsAdmin) throw CustomError.unauthorized("Usuario no autorizado");
            }

            const createEntity = userId ? AccountEntity.createAccountEntity : AccountEntity.createSimpleResponseAccounts;
            const mappedAccounts = accounts.map((x: typeof UserModel) => createEntity(x));

            return {
                accounts: mappedAccounts,
                page,
                pagesize,
                items: mappedAccounts.length,
                totalItems,
                nextPage: page * pagesize < totalItems ? page + 1 : null,
                prevPage: page - 1 > 0 ? page - 1 : null
            };

        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        }
    };

    public async disabledUser(dto: DisabledAccountDto){
        try{
            const account = await UserModel.findById(dto.accountId);
            if(!account) throw CustomError.badRequestResult("Cuenta no existe");
            const userIsAdmin = validateUserAdmin(dto.user);
            if(!userIsAdmin) throw CustomError.unauthorized("Usuario no autorizado para realizar esta acción");

            account.status = "disabled";
            await account.save();
            return account;

        }catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        }
    };

}