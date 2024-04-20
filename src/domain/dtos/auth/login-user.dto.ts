

export class LoginUserDto {
    
    private constructor(
        public readonly email: string,
        public readonly password: string,
    ){}

    static create(object: {[key:string]:any} ): [string?, LoginUserDto?]{
        const {email, password } = object

        if(!email) return ["Email requerido", undefined];
        if(!password) return ["Contraseña Requerida", undefined];

        return [undefined, new LoginUserDto(email, password)];
    }
}