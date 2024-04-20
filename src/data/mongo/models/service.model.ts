import mongoose, { Schema } from "mongoose";

const serviceSchema = new mongoose.Schema({
    account: {
        type: Schema.Types.ObjectId, 
        ref: "Account", 
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId, 
        ref: "Organization", 
        required: true
    },
    category: {
        type: Schema.Types.ObjectId, 
        ref: "Category", 
        required: true
    },
    name: {
        type: String, 
        required: true,
        unique: true
    },
    available: {
        type: Boolean, 
        default: true
    },
    price: {
        type: Number,
        default: 0
    }, 
    description: {
        type: String,
    }
});


export const ServiceModel = mongoose.model("Service", serviceSchema);