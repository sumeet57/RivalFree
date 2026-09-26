import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
    },
    about: {
        type: String,
        required: false,
        maxlength: 2000,
    },
    summary: {
        type: String,
        required: false,
    },
    history: {
        type: [Object],
        required: false,
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

const Feature = mongoose.model("Feature", featureSchema);

export default Feature;