import mongoose, { Schema } from "mongoose";
import { RolesEnum, StatusEnum } from "../../../presentation/services/helper";

const organizationSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    account: { 
        type: Schema.Types.ObjectId, 
        ref: "Account",
    },
    name: { 
        type: String, 
        required: [true, "Nombre requerido"], 
        unique: true
    },
    documentIdentificationType: { 
        type: String, 
        required: [true, "Tipo de documento requerido"],
        unique: true
    },
    documentIdentificationNumber: { 
        type: String, 
        required: [true, "Numero de documento requerido"],
        unique: true
    },
    users: [{ 
        type: Schema.Types.ObjectId, 
        ref: "User",
    }],
    address: { 
        type: String 
    },
    userOwnerId: {
        type: String, 
        required: [true, "Id de usuario principal requerido"] 
    },
    validatorUserAccountId: {
        type:String 
    },
    permissions:[{
        type:String 
    }],
    urlImage: { 
        type: String 
    },
    email: { 
        type: String, 
        required: [true, "Email requerido"], 
        unique: true 
    },
    phoneNumber: { 
        type: String, 
        required: [true, "Numero de teléfono requerido"], 
        unique: true 
    },
    roles: { 
        type: [String], 
        default: ["USER_ORGANIZATION", "ADMIN_ORGANIZATION", "USER_CARGO_ASSISTANT", "USER"], 
        enum: RolesEnum
    },
    status: {
        type: String,
        default: StatusEnum.ENABLED,
        enum: StatusEnum
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
});

export const OrganizationModel = mongoose.model("Organization", organizationSchema);