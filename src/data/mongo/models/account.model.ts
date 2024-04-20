import mongoose, { Schema } from "mongoose";

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
    dateCreated: {
        type: Date,
        required: true,
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
        default: ["ADMIN_ACCOUNT", "USER_ORGANIZATION", "ADMIN_ORGANIZATION", "USER_CARGO_ASSISTANT", "USER"], 
        enum: ["USER_OWNER_ACCOUNT", "ADMIN_ACCOUNT", "USER_ORGANIZATION", "ADMIN_ORGANIZATION", "USER_CARGO_ASSISTANT", "USER"]
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "disabled", "paymentRequired"],
        required: true
    },
    userCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

export const AccountModel = mongoose.model("Account", accountSchema);