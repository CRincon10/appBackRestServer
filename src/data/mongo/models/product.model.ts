import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    userCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
    dateCreated: {
        type: Date,
        required: true,
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
});

productSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

export const ProductModel = mongoose.model("Product", productSchema);
