import { CustomError } from "../errors/custom.error"

export interface UserSimpleResponse {
    name: string;
    lastName?: string;
    image?: string;
}


export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public lastName: string,
        public documentIdentificationType: string,
        public documentIdentificationNumber: number,
        public roles: string[],
        public email: string,
        public phoneNumber: number,
        public emailValidated: boolean,
        public permissions: string[],
        public password: string,
        public dateCreated: string,
        public urlImage?: string,
    ) { }

    static createObjectUser(object: { [key: string]: any }) {
        const {
            id,
            _id,
            name,
            lastName,
            documentIdentificationType,
            documentIdentificationNumber,
            roles,
            email,
            phoneNumber,
            emailValidated,
            permissions,
            password,
            urlImage,
            dateCreated,
        } = object

        if (!id || !_id) throw CustomError.badRequestResult("Missing ID")
        if (!name) throw CustomError.badRequestResult("Missing name")
        if (!email) throw CustomError.badRequestResult("Missing email")
        if (!documentIdentificationType) throw CustomError.badRequestResult("Missing documentIdentificationType")
        if (!documentIdentificationNumber) throw CustomError.badRequestResult("Missing documentIdentificationNumber")
        if (!emailValidated === undefined) throw CustomError.badRequestResult("Missing emailValidated")
        if (!password) throw CustomError.badRequestResult("Missing password")
        if (!roles) throw CustomError.badRequestResult("Missing role")
        if (!dateCreated) throw CustomError.badRequestResult("Missing Date")

        return new UserEntity(
            _id || id,
            name,
            lastName,
            documentIdentificationType,
            documentIdentificationNumber,
            roles,
            email,
            phoneNumber,
            emailValidated,
            permissions,
            password,
            dateCreated,
            urlImage,
        );
    }

    static createSimpleResponseUser(value: UserEntity) {
        const { name, lastName, urlImage } = value
        const userResponse: UserSimpleResponse = {
            name,
            lastName,
            image: urlImage
        }
        return userResponse
    }
}