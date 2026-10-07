import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    about:{
        type: String,
        required: false,
        maxlength: 4000, 
    },
    link:{
        type: String,
        required: false,
        maxlength: 500,
    },
    summary:{
        type: String,
        required: false,
    },
    history:{
        type: [Object],
        required: false,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    features: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feature",
    }],
    chatHistory: [{
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    }]
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;