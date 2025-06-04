import { model, Schema } from "mongoose";

const userModel = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)$/,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        // default: 'Hey welcome.Let start Conversation'
    },
    file : {
        type : String
    },
    friendList: {
        type: Array,
    },
    friendRequestList: {
        type: Array,
    }
},
    {
        strict: true,
    }
)

export const User = model("user", userModel)