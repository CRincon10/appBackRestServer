import mongoose, { Schema } from "mongoose";

const organizationSchema = new mongoose.Schema({
    accountId: { 
        type: Schema.Types.ObjectId, 
        ref: "Account", 
        required: [true] 
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
    roles: { 
        type: [String], 
        default: ["USER", "ADMIN", "CARGO_ASSISTANT"], 
        enum: ["OWNER_USER_ACCOUNT", "USER", "ADMIN", "CARGO_ASSISTANT"] 
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
        required: [true, "Id de usuario principal requerida"] 
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
});

export const OrganizationModel = mongoose.model("Organization", organizationSchema);