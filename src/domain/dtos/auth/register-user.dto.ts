import { regularExps } from "../../../config";


export class RegisterUserDto {
    
    private constructor(
        public readonly name: string,
        public readonly lastName: string,
        public readonly documentIdentificationType: string,
        public readonly documentIdentificationNumber: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public readonly password: string,
        public readonly roles: string[],

    ){}

    static create(object: {[key:string]:any} ): [string?, RegisterUserDto?]{
        const {name, lastName, documentIdentificationType, documentIdentificationNumber, email, phoneNumber, password, roles } = object

        if(!name) return ["name requerido", undefined];
        if(!lastName) return ["lastName requerido", undefined];
        if(!documentIdentificationType) return ["documentIdentificationType requerido", undefined];
        if(!documentIdentificationNumber) return ["documentIdentificationNumber requerido", undefined];
        if(!email) return ["email requerido", undefined];
        if(!regularExps.email.test(email)) return ["Formato de email invalido", undefined];
        if(!phoneNumber) return ["phoneNumber requerido", undefined];
        if(!password) return ["Contraseña requerida", undefined];
        if(!regularExps.password.test(password)) return ["Formato de contraseña invalido", undefined];

        return [undefined, new RegisterUserDto(name, lastName, documentIdentificationType, documentIdentificationNumber, email, phoneNumber, password, roles )];
    }
}