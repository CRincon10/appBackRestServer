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
    organizationName: { 
        type: String, 
        required: [true, "Nombre requerido"], 
        unique: true
    },
    documentOrganizationType: { 
        type: String, 
        required: [true, "Tipo de documento requerido"],
        unique: true
    },
    documentIdentificationNumberOrganization: { 
        type: Number, 
        required: [true, "Numero de documento requerido"],
        unique: true
    },
    users: [{ 
        type: Schema.Types.ObjectId, 
        ref: "User",
    }],
    addressOrganization: { 
        type: String 
    },
    cityOrganization: { 
        type: Schema.Types.Mixed,
    },
    stateNameOrganization: { 
        type: Schema.Types.Mixed, 
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
    emailOrganization: { 
        type: String, 
        required: [true, "Email requerido"], 
        unique: true 
    },
    phoneNumberOrganization: { 
        type: Number, 
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
        default: StatusEnum.PENDING,
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