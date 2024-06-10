export class AccountDto {
    private constructor(
        public readonly name: string,
        public readonly documentType: string,
        public readonly documentNumber: number,
        public readonly userCreatorId: string,
        public readonly userCreator: string,
        public readonly users: string[],
        public readonly address?: string,
        public readonly phoneNumber?: string,
        public readonly urlImage?: string,
    ) { }

    static createAccount(object: { [key: string]: any }): [string?, AccountDto?] {
        const { name, documentType, documentNumber, userCreatorId, address, phoneNumber, urlImage } = object;

        if (!name) return ["name requerido", undefined];
        if (!documentType) return ["documentType requerido", undefined];
        if (!documentNumber) return ["documentNumber requerido", undefined];
        if (!userCreatorId) return ["userCreatorId requerido", undefined];

        const userCreator = userCreatorId;
        const users = [userCreator];

        return [undefined, new AccountDto(name, documentType, documentNumber, userCreatorId, userCreator, users, address, phoneNumber, urlImage)];
    }
}
