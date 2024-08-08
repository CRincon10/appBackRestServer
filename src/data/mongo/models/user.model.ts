import mongoose, { Schema } from "mongoose";
import { RolesEnum, StatusEnum } from "../../../presentation/services/helper";

const userSchema = new mongoose.Schema({
    accountId:{
        type: String,
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
    },
    organizationId:{
        type: String,
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
    },
    firstName: {
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
        default: ["USER"],
        enum: RolesEnum
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
    status: {
        type: String,
        default: StatusEnum.ENABLED,
        enum: StatusEnum,
        required: true
    },
    userCreatorId: {
        type: String
    },
    userCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.password;
    },
});

export const UserModel = mongoose.model("User", userSchema);