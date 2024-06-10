export class CategoryDto {
    
    private constructor(
        public readonly name: string,
        public readonly accountId: string,
        public readonly account: string,
        public readonly userCreatorId: string,
        public readonly userCreator: string,
    ){}

    static create(object: {[key:string]:any} ): [string?, CategoryDto?]{
        const {name, accountId, userCreatorId } = object

        if(!name) return ["name requerido", undefined];
        if(!accountId) return ["accountId requerido", undefined];
        if(!userCreatorId) return ["accountId requerido", undefined];
        const userCreator = userCreatorId;
        const account = accountId;

        return [undefined, new CategoryDto(name, accountId, account, userCreatorId, userCreator )];
    };
};