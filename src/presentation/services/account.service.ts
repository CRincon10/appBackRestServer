import { UserModel } from "../../data";
import { AccountModel } from '../../data/mongo/models/account.model';
import { CustomError, PaginationDto, UserEntity } from "../../domain";
import { AccountDto } from "../../domain/dtos/accounts/account.dto";
import { DisabledAccountDto } from "../../domain/dtos/shared/requests/account.request.dto";
import { AccountEntity } from '../../domain/entities/account.entity';
import { validateUserAdmin } from "./helper";


export class AccountService {

    constructor() { }

    public async createAccount(accountDto: AccountDto) {
        const existAccount = await AccountModel.findOne({ documentNumber: accountDto.documentNumber });
        if (existAccount) throw CustomError.badRequestResult("Ya existe una cuenta con este numero de documento");

        try {
            const newAccount = new AccountModel(accountDto);
            newAccount.dateCreated = new Date();
            await newAccount.save();
            const { userCreator, users, permissions, organizations, ...account } = AccountEntity.createAccountEntity(newAccount);
            return account;

        } catch (err) {
            throw CustomError.internalServer(`${err}`)
        }
    }

    public async getAccounts(pagination: PaginationDto, userId?: string) {
        const { page, pagesize } = pagination;

        try {
            let tasks: any[] = [
                AccountModel.countDocuments(),
                AccountModel.find().populate("userCreator")
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
            const mappedAccounts = accounts.map((x: typeof AccountModel) => createEntity(x));

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

    public async disabledAccount(dto: DisabledAccountDto){
        try{
            const account = await AccountModel.findById(dto.accountId);
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