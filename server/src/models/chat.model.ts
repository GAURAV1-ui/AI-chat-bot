import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    response: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
})

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;