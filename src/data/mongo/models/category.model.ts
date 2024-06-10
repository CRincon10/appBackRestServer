import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
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
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
    available: {
        type: String,
        default: true
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

export const CategoryModel = mongoose.model("Category", categorySchema);