import { regularExps } from "../../../config";
import { RolesList } from '../../../presentation/services/helper';


export class RegisterUserDto {
    private constructor(
        public readonly name: string,
        public readonly lastName: string,
        public readonly documentIdentificationType: string,
        public readonly documentIdentificationNumber: number,
        public readonly email: string,
        public readonly phoneNumber: number,
        public readonly password: string,
        public readonly roles: string[],
        public readonly id?: string,
        public readonly accountId?: string,
        public readonly account?: string,
        public readonly organizationId?: string,
        public readonly organization?: string,
        public readonly userCreatorId?: string,
        public readonly userCreator?: string
    ) {}

    static createUser(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const {
            name, lastName, documentIdentificationType, documentIdentificationNumber, email, phoneNumber, password, roles, id, accountId, organizationId, userCreatorId
        } = object;

        if (!name) return ["name requerido", undefined];
        if (!lastName) return ["lastName requerido", undefined];
        if (!documentIdentificationType) return ["documentIdentificationType requerido", undefined];
        if (!documentIdentificationNumber) return ["documentIdentificationNumber requerido", undefined];
        if (!email) return ["email requerido", undefined];
        if (!regularExps.email.test(email)) return ["Formato de email invalido", undefined];
        if (!phoneNumber) return ["phoneNumber requerido", undefined];
        if (!password) return ["Contraseña requerida", undefined];
        if (!regularExps.password.test(password)) return ["Formato de contraseña invalido", undefined];
        if (!roles || !Array.isArray(roles) || roles.length === 0) return ["roles de usuario requeridos", undefined];
        if (!roles.every(role => RolesList.includes(role))) return ["roles inválidos", undefined];

        return [
            undefined,
            new RegisterUserDto(
                name,
                lastName,
                documentIdentificationType,
                documentIdentificationNumber,
                email,
                phoneNumber,
                password,
                roles,
                id,
                accountId,
                accountId, // Asignar accountId directamente a account
                organizationId,
                organizationId, // Asignar organizationId directamente a organization
                userCreatorId,
                userCreatorId // Asignar userCreatorId directamente a userCreator
            )
        ];
    }
}