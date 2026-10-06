import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Thread", ThreadSchema);

// Alternatively, you can use Mongoose's built-in timestamps option to automatically manage createdAt and updatedAt fields. 
// Here's how you can modify the ThreadSchema to use this feature:

// const ThreadSchema = new mongoose.Schema({
//     threadId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     title: {
//         type: String,
//         default: "New Chat"
//     },
//     messages: [MessageSchema]
//     // Mongoose adds createdAt and updatedAt automatically and updates updatedAt on every save
// }, { timestamps: true });