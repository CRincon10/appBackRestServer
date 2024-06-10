import mongoose, { Schema } from "mongoose";
import { RolesEnum, StatusEnum } from "../../../presentation/services/helper";

const accountSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Nombre de la cuenta requerido"] 
    },
    documentType: { 
        type: String, 
        required: [true, "Tipo de documento requerido"] 
    },
    documentNumber: { 
        type: Number, 
        required: [true, "Numero de documento requerido"] 
    },
    address: { 
        type: String 
    },
    phoneNumber: { 
        type: String 
    },
    urlImage: {
        type: String
    },
    users: [
        { 
            type: Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
    organizations: [
        { 
            type: Schema.Types.ObjectId, 
            ref: "Organizations" 
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
    userOwnerId: { 
        type: String, 
    },
    permissions: [
        { 
            type: String 
        }
    ],
    roles: { 
        type: [String], 
        default: [
            "ADMIN_ACCOUNT", 
            "USER_OWNER_ORGANIZATION", 
            "ADMIN_ORGANIZATION", 
            "ADMIN_ORGANIZATION",
            "USER_CARGO_ASSISTANT",
            "USER"], 
        enum: RolesEnum
    },
    status: {
        type: String,
        default: StatusEnum.ENABLED,
        enum: StatusEnum
    },
    userCreatorId: {
        type: String
    },
    userCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

accountSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__V;
    },
});

export const AccountModel = mongoose.model("Account", accountSchema);