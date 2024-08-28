import { regularExps } from "../../../config";
import { City, State, TypeRegister, TypeRegisterList, UserDocumentType } from "../../../presentation/auth/helper";
import { RolesEnum, RolesList } from "../../../presentation/services/helper";

export class RegisterUserDto {
    private constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly documentIdentificationType: UserDocumentType,
        public readonly documentIdentificationNumber: number,
        public readonly email: string,
        public readonly phoneNumber: number,
        public readonly password: string,
        public readonly typeRegister: TypeRegister,
        public readonly roles: RolesEnum[],
        public readonly firebaseId?: string,
        public readonly firebaseProviderName?: string,
        public readonly address?: string,
        public readonly city?: City,
        public readonly state?: State,

        //datos cuando se crea un usuario
        public readonly accountId?: string,
        public readonly organizationId?: string,
        public readonly id?: string,
        public readonly userCreatorId?: string,

        //campos de creacion de organizacion
        public readonly organizationName?: string,
        public readonly documentIdentificationNumberOrganization?: number,
        public readonly documentIdentificationTypeOrganization?: UserDocumentType,
        public readonly emailOrganization?: string,
        public readonly phoneNumberOrganization?: number,
        public readonly addressOrganization?: string,
        public readonly cityOrganization?: City,
        public readonly stateOrganization?: State
    ) {}

    static createUser(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const {
            firstName,
            lastName,
            documentIdentificationType,
            documentIdentificationNumber,
            email,
            phoneNumber,
            password,
            typeRegister,
            roles,
            firebaseId,
            firebaseProviderName,
            address,
            city,
            state,
            accountId,
            organizationId,
            id,
            userCreatorId,

            organizationName,
            documentIdentificationNumberOrganization,
            documentIdentificationTypeOrganization,
            emailOrganization,
            phoneNumberOrganization,
            addressOrganization,
            cityOrganization,
            stateOrganization,
        } = object;

        if (!firstName) return ["firstName requerido", undefined];
        if (!lastName) return ["lastName requerido", undefined];
        if (!documentIdentificationType) return ["documentIdentificationType requerido", undefined];
        if (!documentIdentificationNumber) return ["documentIdentificationNumber requerido", undefined];
        if (!email) return ["email requerido", undefined];
        if (!regularExps.email.test(email)) return ["Formato de email invalido", undefined];
        if (!phoneNumber) return ["phoneNumber requerido", undefined];
        if (!password) return ["Contraseña requerida", undefined];
        if (!regularExps.password.test(password)) return ["Formato de contraseña invalido", undefined];
        if (!roles || !Array.isArray(roles) || roles.length === 0) return ["roles de usuario requeridos", undefined];
        if (!roles.every((role) => RolesList.includes(role))) return ["roles inválidos", undefined];

        return [
            undefined,
            new RegisterUserDto(
                firstName,
                lastName,
                documentIdentificationType,
                documentIdentificationNumber,
                email,
                phoneNumber,
                password,
                typeRegister,
                roles,
                firebaseId,
                firebaseProviderName,
                address,
                city,
                state,
                accountId,
                organizationId,
                id,
                userCreatorId,
                organizationName,
                documentIdentificationNumberOrganization,
                documentIdentificationTypeOrganization,
                emailOrganization,
                phoneNumberOrganization,
                addressOrganization,
                cityOrganization,
                stateOrganization
            ),
        ];
    }
}