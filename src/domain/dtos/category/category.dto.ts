export class CategoryDto {
    
    private constructor(
        public readonly name: string,
        public readonly accountId: string,
        public readonly userCreator: string,
    ){}

    static create(object: {[key:string]:any} ): [string?, CategoryDto?]{
        const {name, accountId, user } = object

        if(!name) return ["name requerido", undefined];
        if(!accountId) return ["accountId requerido", undefined];

        const userCreator = user.id

        return [undefined, new CategoryDto(name, accountId, userCreator,  )];
    }
}