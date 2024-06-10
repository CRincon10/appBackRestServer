import mongoose from "mongoose";
import { UserEntity } from "../../domain";

export enum RolesEnum {
    SUPER_ADMIN = "SUPER_ADMIN",
    USER_OWNER_ACCOUNT = "USER_OWNER_ACCOUNT",
    ADMIN_ACCOUNT = "ADMIN_ACCOUNT",
    USER_OWNER_ORGANIZATION = "USER_OWNER_ORGANIZATION",
    ADMIN_ORGANIZATION = "ADMIN_ORGANIZATION",
    USER_CARGO_ASSISTANT = "USER_CARGO_ASSISTANT",
    USER = "USER"
};

export const RolesList: RolesEnum[] = [
    RolesEnum.SUPER_ADMIN,
    RolesEnum.USER_OWNER_ACCOUNT,
    RolesEnum.ADMIN_ACCOUNT,
    RolesEnum.USER_OWNER_ORGANIZATION,
    RolesEnum.ADMIN_ORGANIZATION,
    RolesEnum.USER_CARGO_ASSISTANT,
    RolesEnum.USER
];

export enum StatusEnum {
    ENABLED = "ENABLED",
    DISABLED = "DISABLED",
    PAYMENT_REQUIRED = "PAYMENT_REQUIRED"
};

export const StatusList: StatusEnum[] = [
    StatusEnum.ENABLED,
    StatusEnum.DISABLED,
    StatusEnum.PAYMENT_REQUIRED
];

export const validateUserSuperAdmin = (roles: string[]) => {
    if (roles.includes(RolesEnum.SUPER_ADMIN)) return true;
    return false;
};

export const validateUserOwnerAccount = (roles: string[]) => {
    if (roles.includes(RolesEnum.USER_OWNER_ACCOUNT)) return true;
    return false;
}

export const mongoIdIsValid = (id: string) => {
    if (!mongoose.isValidObjectId(id)) {
        return false;
    }
    return true;
};
