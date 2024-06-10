import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
    },
    categoryId: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    taxes: [
        {
            tax: { id: String, description: String, percentage: Number },
        },
    ],
    name: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
    lastDateUpdated: {
        type: Date,
    },
    price: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
    urlImage: {
        type: String,
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

productSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

export const ProductModel = mongoose.model("Product", productSchema);
