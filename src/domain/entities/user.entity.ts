import { CustomError } from "../errors/custom.error"
import { AccountEntity } from "./account.entity";

export interface UserSimpleResponse {
    id: string;
    firstName: string;
    lastName?: string;
    image?: string;
    status?: string;
}


export class UserEntity {

    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public documentIdentificationType: string,
        public documentIdentificationNumber: number,
        public roles: string[],
        public email: string,
        public phoneNumber: number,
        public emailValidated: boolean,
        public permissions: string[],
        public password: string,
        public createdAt: string,
        public updatedAt: string,
        public urlImage?: string,
        public accountId?: string,
        public account?: AccountEntity,
        public organizationId?: string,
        public organization?: string,
        public status?: string,
    ) { }

    static createObjectUser(object: { [key: string]: any }) {
        const {
            id,
            _id,
            firstName,
            lastName,
            documentIdentificationType,
            documentIdentificationNumber,
            roles,
            email,
            phoneNumber,
            emailValidated,
            permissions,
            password,
            createdAt,
            updatedAt,
            urlImage,
            accountId,
            account,
            organizationId,
            organization,
            status
        } = object;

        if (!id || !_id) throw CustomError.badRequestResult("Id requerido")
        if (!firstName) throw CustomError.badRequestResult("firstName requerido")
        if (!email) throw CustomError.badRequestResult("Email requerido")
        if (!documentIdentificationType) throw CustomError.badRequestResult("DocumentIdentificationType requerido")
        if (!documentIdentificationNumber) throw CustomError.badRequestResult("DocumentIdentificationNumber requerido")
        if (!password) throw CustomError.badRequestResult("Password requerida")
        if (!roles) throw CustomError.badRequestResult("Role requerido")
        if (!createdAt) throw CustomError.badRequestResult("iDate requerida")

        return new UserEntity(
            _id || id,
            firstName,
            lastName,
            documentIdentificationType,
            documentIdentificationNumber,
            roles,
            email,
            phoneNumber,
            emailValidated,
            permissions,
            password,
            createdAt,
            updatedAt,
            urlImage,
            accountId,
            account,
            organizationId,
            organization,
            status
        );
    }

    static createSimpleResponseUser(object: { [key: string]: any }) {
        const { id, firstName, lastName, urlImage, status } = object
        const userResponse: UserSimpleResponse = {
            id,
            firstName,
            lastName,
            image: urlImage, 
            status
        }
        return userResponse
    }
};