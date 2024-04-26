import mongoose from "mongoose";
import { UserEntity } from "../../domain";

export const validateUserAdmin = (user: UserEntity) => {
    const adminRol = "SUPER_ADMIN";
    if (user.roles.includes(adminRol)) return true;
    return false;
};

export const mongoIdIsValid = (id: string) => {
    if (!mongoose.isValidObjectId(id)) {
        return false;
    }
    return true;
};
