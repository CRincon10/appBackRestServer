import { UserModel } from "../../data";
import { AccountModel } from '../../data/mongo/models/account.model';
import { CustomError, PaginationDto, UserEntity } from "../../domain";
import { AccountDto } from "../../domain/dtos/accounts/account.dto";
import { DisabledAccountDto } from "../../domain/dtos/shared/requests/account.request.dto";
import { AccountEntity } from '../../domain/entities/account.entity';
import { RolesEnum, validateUserSuperAdmin } from "./helper";

export class AccountService {
    constructor() {}

    private readonly authorizedAccountRoles = [RolesEnum.USER_OWNER_ACCOUNT, RolesEnum.ADMIN_ACCOUNT];
    private readonly authorizedOrganizationRoles = [RolesEnum.USER_OWNER_ORGANIZATION, RolesEnum.ADMIN_ORGANIZATION];

    public async createAccount(accountDto: AccountDto) {
        const existAccount = await AccountModel.findOne({ documentNumber: accountDto.documentNumber });
        if (existAccount) throw CustomError.badRequestResult("Ya existe una cuenta con este numero de documento");

        const user = await UserModel.findById(accountDto.userCreator);
        if (!user) throw CustomError.badRequestResult("Usuario no encontrado");

        const userAuthorized = validateUserSuperAdmin(user.roles);
        if (!userAuthorized) throw CustomError.unauthorized("Usuario no autorizado para crear cuentas");

        try {
            const newAccount = new AccountModel(accountDto);
            await newAccount.save();
            const { userCreator, users, permissions, organizations, ...account } = AccountEntity.createAccountEntity(newAccount);
            return account;
        } catch (err) {
            throw CustomError.internalServer(`${err}`);
        }
    }

    public async getAccounts(pagination: PaginationDto, userId?: string) {
        const { page, pagesize } = pagination;

        try {
            let tasks: any[] = [
                AccountModel.countDocuments(),
                AccountModel.find()
                    .populate("userCreator")
                    .populate("users")
                    .skip((page - 1) * pagesize)
                    .limit(pagesize),
            ];

            if (userId) tasks.push(tasks.push(UserModel.findById(userId) as unknown as Promise<Document>));

            const [totalItems, accounts, user] = await Promise.all(tasks);

            if (accounts.length <= 0) {
                throw CustomError.badRequestResult("No se encontraron cuentas");
            }

            if (userId && !user) {
                throw CustomError.badRequestResult("Usuario administrador no encontrado");
            } else if (userId && user) {
                const userIsAdmin = validateUserSuperAdmin(user.roles);
                if (!userIsAdmin) throw CustomError.unauthorized("Usuario no autorizado");
            }

            const createEntity = userId ? AccountEntity.createAccountEntity : AccountEntity.createSimpleResponseAccount;
            const mappedAccounts = accounts.map((x: typeof AccountModel) => createEntity(x));

            return {
                accounts: mappedAccounts,
                page,
                pagesize,
                items: mappedAccounts.length,
                totalItems,
                nextPage: page * pagesize < totalItems ? page + 1 : null,
                prevPage: page - 1 > 0 ? page - 1 : null,
            };
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        }
    }

    public async changeStatusAccount(dto: DisabledAccountDto) {
        try {
            const [account, userRequest] = await Promise.all([
                AccountModel.findById(dto.accountId),
                UserModel.findById(dto.userRequestId)
            ]);

            if (!userRequest) throw CustomError.badRequestResult("Usuario que realiza solicitud no existe.");
            if (!account) throw CustomError.badRequestResult(`Cuenta con el Id ${dto.accountId} no existe.`);

            const userIsSuperAdmin = validateUserSuperAdmin(userRequest.roles);

            if (!userIsSuperAdmin) {
                throw CustomError.badRequestResult(`El Usuario con el Id ${account.id} no pertenece a esta organización`);
            };

            account.status = dto.status;
            await account.save();

            return {
                accountUpdated: AccountEntity.createSimpleResponseAccount(account)
            }

        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        };
    }
}