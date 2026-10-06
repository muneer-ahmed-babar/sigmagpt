import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// All routes in chat.js now start with /api (example: /api/chat, /api/thread)
app.use("/api", chatRoutes);

// Connect to MongoDB first, then start the server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch (err) {
        console.log("Failed to connect with Db", err);
    }
};

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});