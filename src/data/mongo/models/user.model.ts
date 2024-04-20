import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
    },
    accountId: {
        type: String,
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
    },
    organizationId: {
        type: String,
    },
    name: {
        type: String,
        required: [true, "Nombre requerido"]
    },
    lastName: {
        type: String,
        required: [true, "Apellido requerido"]
    },
    documentIdentificationType: {
        type: String,
        required: [true, "Tipo de documento requerido"]
    },
    documentIdentificationNumber: {
        type: Number,
        required: [true, "Numero de documento requerido"],
        unique: true
    },
    roles: {
        type: [String],
        default: ["USER_ORGANIZATION"],
        enum: ["SUPER_ADMIN", "USER_OWNER_ACCOUNT", "ADMIN_ACCOUNT", "USER_ORGANIZATION", "ADMIN_ORGANIZATION", "USER_CARGO_ASSISTANT", "USER"]
    },
    email: {
        type: String,
        required: [true, "Email requerido"],
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: [true, "Numero de teléfono requerido"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Contraseña requerida"]
    },
    address: {
        type: String
    },
    urlImage: {
        type: String
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    permissions: [{
        type: String
    }],
    validatorUserId: {
        type: String
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

export const UserModel = mongoose.model("User", userSchema);