import { AccountModel } from "../../data/mongo/models/account.model";
import { CustomError } from "../../domain";
import { AccountDto } from "../../domain/dtos/accounts/account.dto";
import { AccountEntity } from "../../domain/entities/account.entity";


export class AccountService {

    constructor() { }

    public async createAccount(accountDto: AccountDto) {
        const existAccount = await AccountModel.findOne({ documentNumber: accountDto.documentNumber });
        if (existAccount) throw CustomError.badRequestResult("Ya existe una cuenta con este numero de documento");

        try {
            const newAccount = new AccountModel(accountDto);
            newAccount.dateCreated = new Date();
            await newAccount.save();
            const { userCreator, ...account } = AccountEntity.createAccountEntity(newAccount);
            return account;

        } catch (err) {
            throw CustomError.internalServer(`${err}`)
        }
    }

    public async getAccounts() {
        try {
            const accounts = await AccountModel.find().populate("users");
            if (accounts.length <= 0) {
                throw CustomError.badRequestResult("No se encontraron categorías");
            }
            return accounts.map(account => AccountEntity.createAccountEntity(account));
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw CustomError.internalServer(`${err}`);
            }
        }
    }


}