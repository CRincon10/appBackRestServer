import { CustomError } from "../errors/custom.error";
import { UserEntity, UserSimpleResponse } from "./user.entity";



export class AccountEntity {

    constructor(
        public name: string,
        public documentType: boolean,
        public documentNumber: boolean,
        public userCreator?: UserSimpleResponse,
    ){}

    static createAccountEntity(object: {[key: string]:any }){
        const {name, documentType, documentNumber,  userCreator} = object;
        let user = undefined;

        if(!name) throw CustomError.badRequestResult("Nombre de la cuenta requerido");
        if(!documentType) throw CustomError.badRequestResult("Tipo de documento de la cuenta requerido");
        if (!documentNumber) throw CustomError.badRequestResult("Numero de documento de la cuenta requerido");

        if(userCreator){
            user = UserEntity.createSimpleResponseUser(userCreator)
        };

        return new AccountEntity(name, documentType, documentNumber, user);
    }
}