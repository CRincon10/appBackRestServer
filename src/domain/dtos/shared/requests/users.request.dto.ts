import { StatusEnum, StatusList } from "../../../../presentation/services/helper";


export class RequestGetUsersDto {
    private constructor(
        public readonly page: number,
        public readonly pageSize: number,
        public readonly requestUserId: string,
        public readonly accountId?: string,
        public readonly organizationId?: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RequestGetUsersDto?] {
        const { page, pageSize, accountId, organizationId, requestUserId } = object;

        if (!page) return ["page requerido", undefined];
        if (!pageSize) return ["pageSize requerido", undefined];
        if (!requestUserId) return ["requestUserId requerido", undefined];

        return [undefined, new RequestGetUsersDto(page, pageSize, requestUserId, accountId, organizationId)];
    }
};

export class UpdateStatusUserDto {
    private constructor(
        public readonly requestUserId: string,
        public readonly userIdToChangeStatus: string,
        public readonly status: StatusEnum,
        public readonly accountId?: string,
        public readonly organizationId?: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateStatusUserDto?] {
        const { requestUserId, userIdToChangeStatus, accountId, newStatus, organizationId } = object;

        if (!requestUserId) return ["requestUserId requerido", undefined];
        if (!userIdToChangeStatus) return ["userIdToChangeStatus requerido", undefined];
        if (!newStatus || !StatusList.includes(newStatus)) return ["newStatus invalido", undefined];
        const status = newStatus

        return [undefined, new UpdateStatusUserDto(requestUserId, userIdToChangeStatus, status, accountId, organizationId)];
    }
}