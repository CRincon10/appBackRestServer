import { CustomError } from "../errors/custom.error";
import { UserEntity, UserSimpleResponse } from "./user.entity";



export class AccountEntity {

    constructor(
        public name: string,
        public documentType: boolean,
        public documentNumber: boolean,
        public userCreator?: UserSimpleResponse,
        public users?: UserEntity[],
        public permissions?: string[],
        public organizations?: any,
        public urlImage?: any,
    ){}

    static createAccountEntity(object: {[key: string]:any }){
        const {name, documentType, documentNumber,  userCreator, users, permissions, organizations, urlImage } = object;
        let user = undefined;

        if(!name) throw CustomError.badRequestResult("Nombre de la cuenta requerido");
        if(!documentType) throw CustomError.badRequestResult("Tipo de documento de la cuenta requerido");
        if (!documentNumber) throw CustomError.badRequestResult("Numero de documento de la cuenta requerido");

        if(userCreator){
            user = UserEntity.createSimpleResponseUser(userCreator)
        };

        if(users) users.map((x:any) => UserEntity.createObjectUser(x));

        return new AccountEntity(name, documentType, documentNumber, user, users, permissions, organizations, urlImage);
    }

    static createSimpleResponseAccounts(object: {[key: string]:any }){
        const {name, documentType, documentNumber, urlImage } = object;
        return new AccountEntity(name, documentType, documentNumber, urlImage);
    }
}