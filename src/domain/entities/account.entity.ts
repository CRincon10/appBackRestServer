import { CustomError } from "../errors/custom.error";
import { UserEntity, UserSimpleResponse } from "./user.entity";



export class AccountEntity {

    constructor(
        public id: string,
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
        const {id, name, documentType, documentNumber,  userCreator, users, permissions, organizations, urlImage } = object;
        let user = undefined;

        if(!name) throw CustomError.badRequestResult("Nombre de la cuenta requerido");
        if(!documentType) throw CustomError.badRequestResult("Tipo de documento de la cuenta requerido");
        if (!documentNumber) throw CustomError.badRequestResult("Numero de documento de la cuenta requerido");

        if(userCreator){
            user = UserEntity.createSimpleResponseUser(userCreator)
        };

        return new AccountEntity(id, name, documentType, documentNumber, user, users, permissions, organizations, urlImage);
    }

    static createSimpleResponseAccount(object: {[key: string]:any }){
        const {id, name, documentType, documentNumber, urlImage, status } = object;
        return new AccountEntity(id, name, documentType, documentNumber, urlImage, status);
    }
}