import mongoose from "mongoose";

const limitSchema = new mongoose.Schema({
    projectLimit: {
        type: Number,
        default: 3,
    },
    featureLimit: {
        type: Number,
        default: 10,
    },
    aiLimit: {
        type: Number,
        default: 100, 
    },
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        email: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    limits: {
        type: limitSchema,
        default: () => ({}),
    },

    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    }],
    features: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feature",
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;