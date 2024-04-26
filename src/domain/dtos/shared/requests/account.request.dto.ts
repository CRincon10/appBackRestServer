import { UserEntity } from "../../../entities/user.entity";

export class DisabledAccountDto {
    private constructor(
        public readonly accountId: string,
        public readonly user: UserEntity,
    ) { }

    static create(object: { [key: string]: any }): [string?, DisabledAccountDto?] {
        const { accountId, user } = object;

        if (!accountId) return ["accountId requerido", undefined];
        if (!user) return ["userId requerido", undefined];

        return [undefined, new DisabledAccountDto(accountId, user)];
    }
}
