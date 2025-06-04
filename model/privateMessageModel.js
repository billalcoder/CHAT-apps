import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";


const privateMessageModel = new Schema({
      name: {
        type: String,
        required: true,
        maxLength: 20,
    },
    sender : {
        type : Types.ObjectId,
        required : true,
        
    },
    reciver : {
        type : Types.ObjectId,
        default : null
    },
    message : {
         type: mongoose.Schema.Types.Mixed,
         default : "let stay connected"
    }
})


export const PrivateMessage = model("privateMessage" , privateMessageModel)