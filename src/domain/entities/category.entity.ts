import { CustomError } from "../errors/custom.error";
import { UserEntity, UserSimpleResponse } from "./user.entity";



export class CategoryEntity {

    constructor(
        public name: string,
        public dateCreated: boolean,
        public userCreator?: UserSimpleResponse,
    ){}

    static createCategoryEntity(object: {[key: string]:any }){
        const {name, accountId, userCreator, dateCreated} = object
        let user = undefined;

        if(!accountId) throw CustomError.badRequestResult("Missing accountId")
        if(!dateCreated) throw CustomError.badRequestResult("Missing dateCreate")
        if(userCreator){
            user = UserEntity.createSimpleResponseUser(userCreator)
        }

        return new CategoryEntity(name, dateCreated, user);
    }
}