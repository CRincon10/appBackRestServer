export class AccountDto {
    private constructor(
        public readonly name: string,
        public readonly documentType: string,
        public readonly documentNumber: number,
        public readonly userCreator: string,
        public readonly address?: string,
        public readonly phoneNumber?: string,
        public readonly urlImage?: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, AccountDto?] {
        const { name, documentType, documentNumber, user, address, phoneNumber, urlImage } = object;

        if (!name) return ["name requerido", undefined];
        if (!documentType) return ["documentType requerido", undefined];
        if (!documentNumber) return ["documentNumber requerido", undefined];

        const userCreator = user.id;

        return [undefined, new AccountDto(name, documentType, documentNumber, userCreator, address, phoneNumber, urlImage)];
    }
}
