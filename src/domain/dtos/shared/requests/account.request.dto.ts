import { UserEntity } from "../../../entities/user.entity";

export class DisabledAccountDto {
    private constructor(
        public readonly accountId: string,
        public readonly userRequestId: string,
        public readonly status: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, DisabledAccountDto?] {
        const { accountId, userRequestId, status } = object;

        if (!accountId) return ["accountId requerido", undefined];
        if (!userRequestId) return ["userRequestId requerido", undefined];
        if (!userRequestId) return ["userRequestId requerido", undefined];

        return [undefined, new DisabledAccountDto(accountId, userRequestId, status)];
    }
}
