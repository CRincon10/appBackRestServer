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
    dateCreated: {
        type: Date,
        required: true,
    },
    available: {
        type: String,
        default: true
    },
    userCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

export const CategoryModel = mongoose.model("Category", categorySchema);