import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
})

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;